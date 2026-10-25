#!/usr/bin/env node
/**
 * Reads the board from setup-fixture.mjs and compares each parent's rollup
 * with the documented behaviour: the column's configured function applied
 * to the parent's children. Read-only. Node 18+, no dependencies.
 *
 * Per API version: column metadata (function, settings), every item's
 * values with parent_item and is_leaf (ground truth), and the parents'
 * rollups. After 10 s it reads the parents again at every version to show
 * the values are stable.
 *
 * Prints, per request: the request body, API-Version, status, x-request-id,
 * extensions.request_id and start/end timestamps; per parent and column: the
 * configured function, the value it predicts, the observed value and which
 * function the observed value matches. Writes every capture (request body,
 * response headers and body; never the token) to repro-results.json next to
 * this script (or REPRO_RESULTS_FILE).
 *
 * Env:
 *   MONDAY_API_TOKEN     API token (sent only in the Authorization header)
 *   MONDAY_API_VERSIONS  optional; comma-separated, default 2026-04,2026-10
 *   FIXTURE_IDS_FILE     optional; default ./fixture-ids.json beside this script
 *   REPRO_RESULTS_FILE   optional; default ./repro-results.json beside this script
 *
 *   node run-repro.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const API_URL = "https://api.monday.com/v2";
const TOKEN = process.env.MONDAY_API_TOKEN;
const VERSIONS = (process.env.MONDAY_API_VERSIONS ?? "2026-04,2026-10").split(
  ",",
);
const FIXTURE_FILE =
  process.env.FIXTURE_IDS_FILE ??
  new URL("./fixture-ids.json", import.meta.url).pathname;
const RESULTS_FILE =
  process.env.REPRO_RESULTS_FILE ??
  new URL("./repro-results.json", import.meta.url).pathname;
const PAUSE_MS = 1200;
const STABILITY_WAIT_MS = 10_000;

if (!TOKEN) throw new Error("MONDAY_API_TOKEN is not set");
const fixture = JSON.parse(readFileSync(FIXTURE_FILE, "utf8"));
const boardId = fixture.board.id;
const columns = Object.values(fixture.columns).filter((c) => c.id);
const columnIds = columns.map((c) => c.id);
const parentIds = Object.keys(fixture.parents).map((k) => fixture.items[k]);

const VALUE_FIELDS =
  "id type text value is_leaf ... on NumbersValue { number } ... on DateValue { date } ... on TimelineValue { from to }";
const METADATA =
  "query ($b: [ID!]) { boards(ids: $b) { id name hierarchy_type columns(capabilities: [CALCULATED]) { id title type settings settings_str capabilities { calculated { function } } } } }";
const GROUND_TRUTH = `query ($b: [ID!], $c: [String!]) { boards(ids: $b) { items_page(limit: 100, hierarchy_scope_config: "allItems") { items { id name parent_item { id } column_values(ids: $c, capabilities: [CALCULATED]) { ${VALUE_FIELDS} } } } } }`;
const PARENTS = `query ($i: [ID!], $c: [String!]) { items(ids: $i) { id name column_values(ids: $c, capabilities: [CALCULATED]) { ${VALUE_FIELDS} } } }`;

/** Response headers saved to repro-results.json; cookies and infrastructure headers are dropped. */
const KEPT_HEADERS = new Set([
  "api-version",
  "content-type",
  "date",
  "ratelimit",
  "ratelimit-policy",
  "x-request-id",
]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** One POST, no retry; returns everything but the Authorization header. */
const capture = async (step, query, variables, apiVersion) => {
  const requestBody = JSON.stringify({ query, variables });
  const startedAt = new Date().toISOString();
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: TOKEN,
      "API-Version": apiVersion,
      "Content-Type": "application/json",
    },
    body: requestBody,
  });
  const responseBodyRaw = await res.text();
  const endedAt = new Date().toISOString();
  const headers = Object.fromEntries(
    [...res.headers.entries()].filter(([name]) => KEPT_HEADERS.has(name)),
  );
  let responseBody = null;
  try {
    responseBody = JSON.parse(responseBodyRaw);
  } catch {}
  const captured = {
    step,
    endpoint: API_URL,
    apiVersion,
    requestHeaders: { "API-Version": apiVersion, "Content-Type": "application/json" },
    authorizationHeader: "sent; value not recorded",
    requestBody,
    startedAt,
    endedAt,
    status: res.status,
    xRequestId: headers["x-request-id"] ?? null,
    extensionsRequestId: responseBody?.extensions?.request_id ?? null,
    rateLimitHeaders: Object.fromEntries(
      Object.entries(headers).filter(([n]) => /ratelimit|rate-limit|retry-after/i.test(n)),
    ),
    responseHeaders: headers,
    responseBodyRaw,
    responseBody,
  };
  console.log(`\n${step} @ ${apiVersion}: HTTP ${captured.status}`);
  console.log(`  request body: ${requestBody}`);
  console.log(
    `  x-request-id ${captured.xRequestId}, extensions.request_id ${captured.extensionsRequestId}, started ${startedAt}, ended ${endedAt}`,
  );
  if (responseBody?.errors) console.log(`  errors: ${JSON.stringify(responseBody.errors)}`);
  return captured;
};

/** The comparable value of a cell: number, YYYY-MM-DD date, "from..to", or null. */
const valueOf = (cell) => {
  if (!cell) return null;
  if (cell.type === "numbers") return cell.number ?? null;
  if (cell.type === "date") return cell.date || null;
  if (cell.type === "timeline")
    return cell.from && cell.to ? `${cell.from.slice(0, 10)}..${cell.to.slice(0, 10)}` : null;
  return cell.text || null;
};

/** What each function yields over `values` (non-null leaf values) for a column type. */
const candidates = (type, values) => {
  if (type === "timeline") {
    if (values.length === 0) return { MIN_MAX: null, NONE: null };
    const froms = values.map((v) => v.split("..")[0]).sort();
    const tos = values.map((v) => v.split("..")[1]).sort();
    return { MIN_MAX: `${froms[0]}..${tos.at(-1)}`, NONE: null };
  }
  if (values.length === 0) return { SUM: null, MIN: null, MAX: null, NONE: null };
  if (type === "numbers") {
    return {
      SUM: values.reduce((a, b) => a + b, 0),
      MIN: Math.min(...values),
      MAX: Math.max(...values),
      NONE: null,
    };
  }
  const sorted = [...values].sort();
  return { MIN: sorted[0], MAX: sorted.at(-1), NONE: null };
};

const results = [];
const tables = [];
const metadataByVersion = {};

const leafValuesUnder = (parents, cellsByItem, parentId, columnId) => {
  const children = [...parents].filter(([, p]) => p === parentId).map(([c]) => c);
  return children.flatMap((child) => {
    const cell = cellsByItem.get(child)?.[columnId];
    if (cell?.is_leaf) {
      const v = valueOf(cell);
      return v === null ? [] : [v];
    }
    return leafValuesUnder(parents, cellsByItem, child, columnId);
  });
};

const compareParents = (label, apiVersion, functions, truth, parentsRead) => {
  const items = truth.responseBody?.data?.boards?.[0]?.items_page?.items ?? [];
  const parents = new Map(items.map((it) => [it.id, it.parent_item?.id ?? null]));
  const cellsByItem = new Map(
    items.map((it) => [it.id, Object.fromEntries(it.column_values.map((cv) => [cv.id, cv]))]),
  );
  const observedItems = parentsRead.responseBody?.data?.items ?? [];
  const rows = [];
  for (const item of observedItems) {
    const cells = Object.fromEntries(item.column_values.map((cv) => [cv.id, cv]));
    for (const col of columns) {
      const cell = cells[col.id];
      const fn = functions[col.id] ?? null;
      const leafValues = leafValuesUnder(parents, cellsByItem, item.id, col.id);
      const options = candidates(col.type, leafValues);
      const expected = fn && fn in options ? options[fn] : "(unknown function)";
      const observed = valueOf(cell);
      const matches = Object.entries(options)
        .filter(([, v]) => v === observed)
        .map(([name]) => name);
      rows.push({
        apiVersion,
        read: label,
        item: item.name,
        itemId: item.id,
        column: col.title,
        columnId: col.id,
        configuredFunction: fn,
        leafValues,
        expected,
        observed,
        isLeaf: cell?.is_leaf ?? null,
        matches,
        verdict: expected === observed ? "PASS" : "DEVIATES",
        requestId: parentsRead.extensionsRequestId,
      });
    }
  }
  return rows;
};

const leafSanity = (apiVersion, truth) => {
  const items = truth.responseBody?.data?.boards?.[0]?.items_page?.items ?? [];
  const rows = [];
  for (const [key, leaf] of Object.entries(fixture.leafValues)) {
    const item = items.find((it) => it.id === fixture.items[key]);
    const cells = Object.fromEntries((item?.column_values ?? []).map((cv) => [cv.id, cv]));
    for (const col of columns) {
      const written =
        col.type === "numbers"
          ? leaf.number
          : col.type === "date"
            ? leaf.date
            : `${leaf.timeline.from}..${leaf.timeline.to}`;
      const observed = valueOf(cells[col.id]);
      rows.push({
        apiVersion,
        leaf: key,
        column: col.title,
        written,
        observed,
        isLeaf: cells[col.id]?.is_leaf ?? null,
        verdict: written === observed && cells[col.id]?.is_leaf === true ? "PASS" : "DEVIATES",
      });
    }
  }
  return rows;
};

const printRows = (rows) => {
  for (const r of rows) {
    console.log(
      `  ${r.verdict} ${r.item} | ${r.column} | configured ${r.configuredFunction} | leaves [${r.leafValues.join(", ")}] | expected ${JSON.stringify(r.expected)} | observed ${JSON.stringify(r.observed)} (is_leaf ${r.isLeaf}) | matches ${r.matches.join("/") || "none"}`,
    );
  }
};

const truthByVersion = {};
for (const apiVersion of VERSIONS) {
  console.log(`\n=== API-Version ${apiVersion} ===`);
  if (results.length) await sleep(PAUSE_MS);
  const metadata = await capture("metadata", METADATA, { b: [boardId] }, apiVersion);
  results.push(metadata);
  const cols = metadata.responseBody?.data?.boards?.[0]?.columns ?? [];
  const functions = Object.fromEntries(
    cols.map((c) => [c.id, c.capabilities?.calculated?.function ?? null]),
  );
  metadataByVersion[apiVersion] = functions;
  for (const c of cols) {
    let settingsStr = {};
    try {
      settingsStr = JSON.parse(c.settings_str ?? "{}");
    } catch {}
    const calcType = c.settings?.calcType ?? settingsStr.calcType ?? "(absent)";
    console.log(
      `  column ${c.id} "${c.title}" (${c.type}): function ${functions[c.id]}${c.type === "date" ? `, calcType ${calcType}` : ""}, settings ${JSON.stringify(c.settings)}, settings_str ${c.settings_str}`,
    );
  }
  await sleep(PAUSE_MS);
  const truth = await capture(
    "ground-truth",
    GROUND_TRUTH,
    { b: [boardId], c: columnIds },
    apiVersion,
  );
  results.push(truth);
  truthByVersion[apiVersion] = truth;
  const sanity = leafSanity(apiVersion, truth);
  console.log("  leaf sanity (written vs read, is_leaf):");
  for (const r of sanity) {
    console.log(
      `    ${r.verdict} ${r.leaf} | ${r.column} | written ${JSON.stringify(r.written)} | observed ${JSON.stringify(r.observed)} | is_leaf ${r.isLeaf}`,
    );
  }
  tables.push({ apiVersion, kind: "leaf-sanity", rows: sanity });
  await sleep(PAUSE_MS);
  const parentsRead = await capture(
    "parents",
    PARENTS,
    { i: parentIds, c: columnIds },
    apiVersion,
  );
  results.push(parentsRead);
  const rows = compareParents("first", apiVersion, functions, truth, parentsRead);
  printRows(rows);
  tables.push({ apiVersion, kind: "parents", read: "first", rows });
}

console.log(`\nwaiting ${STABILITY_WAIT_MS / 1000} s, then reading the parents again`);
await sleep(STABILITY_WAIT_MS);
for (const apiVersion of VERSIONS) {
  const again = await capture(
    "parents-reread",
    PARENTS,
    { i: parentIds, c: columnIds },
    apiVersion,
  );
  results.push(again);
  const rows = compareParents(
    "reread",
    apiVersion,
    metadataByVersion[apiVersion],
    truthByVersion[apiVersion],
    again,
  );
  printRows(rows);
  tables.push({ apiVersion, kind: "parents", read: "reread", rows });
  await sleep(PAUSE_MS);
}

const out = JSON.stringify({ fixture, tables, results }, null, 2);
if (out.includes(TOKEN)) throw new Error("Refusing to write results: token found");
writeFileSync(RESULTS_FILE, `${out}\n`);
console.log(`\nWrote ${RESULTS_FILE}`);
