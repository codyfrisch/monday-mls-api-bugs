#!/usr/bin/env node
/**
 * Runs the parent-stored-value case against the board from setup-fixture.mjs. At each API
 * version: reads the tree and every rollup cell, reads R1 and A clean,
 * writes distinct values to R1's and A's own rollup cells, reads them again,
 * clears the written values (null) and reads the restored rollups.
 *
 * Per the documentation a parent's rollup is the column's function over its
 * children, and a write to a parent's rollup cell is refused or changes
 * nothing. Prints expected-per-docs vs observed for every parent × column,
 * with request ids and timestamps. Node 18+, no dependencies. Writes every
 * capture (request body, response headers and body; never the token) to
 * repro-results.json next to this script (or REPRO_RESULTS_FILE).
 *
 * Env:
 *   MONDAY_API_TOKEN     API token (sent only in the Authorization header)
 *   MONDAY_API_VERSIONS  optional; comma-separated, default 2026-04,2026-10
 *   FIXTURE_IDS_FILE     optional; default ./fixture-ids.json beside this script
 *   REPRO_RESULTS_FILE   optional; default ./repro-results.json beside this script
 *   REPRO_LEAVE_VALUES   optional; "1" skips the final clear so the written
 *                        values can be inspected on the board in the UI.
 *                        teardown.mjs deletes the board either way.
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
const LEAVE_VALUES = process.env.REPRO_LEAVE_VALUES === "1";
const PAUSE_MS = 1200;
const SETTLE_READS = 5;

if (!TOKEN) throw new Error("MONDAY_API_TOKEN is not set");
const fixture = JSON.parse(readFileSync(FIXTURE_FILE, "utf8"));
const boardId = fixture.board.id;
const ids = fixture.items;
const KEYS = Object.keys(fixture.columns);
const colId = (key) => fixture.columns[key].id;
const colIds = KEYS.map(colId);

/** R1's and A's own values; each pair differs so the rollup shows which were counted. */
const HIDDEN = {
  R1: {
    numSum: 5,
    numMin: 2,
    numMax: 500,
    numNone: 5,
    dateMin: { date: "2020-01-01" },
    dateMax: { date: "2030-01-01" },
    timeline: { from: "2020-01-01", to: "2030-01-01" },
  },
  A: {
    numSum: 1000,
    numMin: 1,
    numMax: 999,
    numNone: 1000,
    dateMin: { date: "2019-01-01" },
    dateMax: { date: "2031-01-01" },
    timeline: { from: "2019-01-01", to: "2031-01-01" },
  },
};
const PARENTS = ["R1", "A"];

const CELL =
  "id type text value is_leaf ... on NumbersValue { number } ... on DateValue { date } ... on TimelineValue { from to }";
const GROUND_TRUTH = `query ($b: [ID!], $c: [String!]) { boards(ids: $b) { items_page(limit: 100, hierarchy_scope_config: "allItems") { cursor items { id name parent_item { id } column_values(ids: $c, capabilities: [CALCULATED]) { ${CELL} } } } } }`;
const METADATA =
  "query ($b: [ID!], $c: [String!]) { boards(ids: $b) { columns(ids: $c) { id title type capabilities { calculated { function } } } } }";
const PARENTS_READ = `query ($i: [ID!], $c: [String!]) { items(ids: $i) { id name column_values(ids: $c, capabilities: [CALCULATED]) { ${CELL} } } }`;
const WRITE =
  "mutation ($b: ID!, $i: ID!, $v: JSON!) { change_multiple_column_values(board_id: $b, item_id: $i, column_values: $v) { id } }";

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
    requestBody,
    startedAt,
    endedAt,
    status: res.status,
    xRequestId: headers["x-request-id"] ?? null,
    extensionsRequestId: responseBody?.extensions?.request_id ?? null,
    rateLimitHeaders: Object.fromEntries(
      Object.entries(headers).filter(([name]) =>
        /ratelimit|rate-limit|retry-after/i.test(name),
      ),
    ),
    responseHeaders: headers,
    responseBodyRaw,
    responseBody,
  };
  console.log(
    `  ${step}: HTTP ${captured.status}, request_id ${captured.extensionsRequestId}, x-request-id ${captured.xRequestId}, ${startedAt} → ${endedAt}`,
  );
  if (responseBody?.errors)
    console.log(`    errors: ${JSON.stringify(responseBody.errors)}`);
  await sleep(PAUSE_MS);
  return captured;
};

const day = (iso) => iso.slice(0, 10);
/** A read cell as a comparable string: number, YYYY-MM-DD, "from - to" or "empty". */
const show = (cell) => {
  if (!cell) return "empty";
  if (typeof cell.number === "number") return String(cell.number);
  if (cell.date) return day(cell.date);
  if (cell.from && cell.to) return `${day(cell.from)} - ${day(cell.to)}`;
  return "empty";
};
/** A written value in the same form. */
const showWritten = (v) =>
  typeof v === "number"
    ? String(v)
    : "date" in v
      ? v.date
      : `${v.from} - ${v.to}`;

/** `fn` over values shown as strings, as the documentation describes a rollup. */
const rollup = (type, fn, values) => {
  const present = values.filter((v) => v !== "empty");
  if (fn === "NONE" || present.length === 0) return "empty";
  if (type === "numbers") {
    const ns = present.map(Number);
    if (fn === "SUM") return String(ns.reduce((a, b) => a + b, 0));
    if (fn === "MIN") return String(Math.min(...ns));
    if (fn === "MAX") return String(Math.max(...ns));
  }
  if (type === "date") {
    const sorted = [...present].sort();
    return fn === "MIN" ? sorted[0] : sorted.at(-1);
  }
  if (type === "timeline") {
    const froms = present.map((v) => v.split(" - ")[0]).sort();
    const tos = present.map((v) => v.split(" - ")[1]).sort();
    return `${froms[0]} - ${tos.at(-1)}`;
  }
  return "empty";
};
/** The function the API is observed to apply per type, whatever the column's function. */
const API_FN = { numbers: "SUM", date: "MIN", timeline: "MIN_MAX" };

const cellsOf = (captured) => {
  const data = captured.responseBody?.data;
  const items = [
    ...(data?.items ?? []),
    ...(data?.boards?.[0]?.items_page?.items ?? []),
  ];
  return Object.fromEntries(
    items.map((item) => [
      item.id,
      Object.fromEntries(
        (item.column_values ?? []).map((cv) => [cv.id, cv]),
      ),
    ]),
  );
};
const r1Sum = (captured) =>
  show(cellsOf(captured)[ids.R1]?.[colId("numSum")]);

const valuesFor = (parent) =>
  JSON.stringify(
    Object.fromEntries(KEYS.map((key) => [colId(key), HIDDEN[parent][key]])),
  );
const CLEARED = JSON.stringify(
  Object.fromEntries(KEYS.map((key) => [colId(key), null])),
);

const readUntil = async (step, apiVersion, done) => {
  const reads = [];
  for (let n = 0; n <= SETTLE_READS; n += 1) {
    const read = await capture(
      n === 0 ? step : `${step} (retry ${n})`,
      PARENTS_READ,
      { i: [ids.R1, ids.A], c: colIds },
      apiVersion,
    );
    reads.push(read);
    if (done(read)) break;
    await sleep(2000);
  }
  return reads;
};

const results = [];
const comparisons = [];
let dirty = false;
const clearAll = async (apiVersion) => {
  const clears = [];
  for (const parent of PARENTS) {
    clears.push(
      await capture(
        `clear ${parent}`,
        WRITE,
        { b: boardId, i: ids[parent], v: CLEARED },
        apiVersion,
      ),
    );
  }
  return clears;
};

try {
  for (const [index, apiVersion] of VERSIONS.entries()) {
    console.log(`\n=== API-Version ${apiVersion} ===`);
    const truth = await capture(
      "ground truth",
      GROUND_TRUTH,
      { b: [boardId], c: colIds },
      apiVersion,
    );
    const meta = await capture(
      "column metadata",
      METADATA,
      { b: [boardId], c: colIds },
      apiVersion,
    );
    const columns = meta.responseBody?.data?.boards?.[0]?.columns ?? [];
    console.log(
      `  columns returned: ${columns.length ? columns.map((c) => `${c.title}=${c.capabilities?.calculated?.function ?? "null"}`).join(", ") : "none"}`,
    );
    const items = truth.responseBody?.data?.boards?.[0]?.items_page?.items ?? [];
    const parentOf = new Map(items.map((it) => [it.id, it.parent_item?.id ?? null]));
    const childrenOf = (id) =>
      [...parentOf].filter(([, p]) => p === id).map(([c]) => c);
    const descendants = (id) =>
      childrenOf(id).flatMap((c) => [c, ...descendants(c)]);
    const truthCells = cellsOf(truth);

    // The expected clean value; nothing is written unless the board reads it.
    const leavesOf = (parent, key) =>
      descendants(ids[parent])
        .filter((id) => childrenOf(id).length === 0)
        .map((id) => show(truthCells[id]?.[colId(key)]));
    const cleanSum = rollup("numbers", "SUM", leavesOf("R1", "numSum"));

    const before = await capture(
      "before",
      PARENTS_READ,
      { i: [ids.R1, ids.A], c: colIds },
      apiVersion,
    );
    if (r1Sum(before) !== cleanSum) {
      throw new Error(
        `R1 Num SUM reads ${r1Sum(before)} before the write, expected ${cleanSum}; not writing`,
      );
    }
    dirty = true;
    const writes = [];
    for (const parent of PARENTS) {
      writes.push(
        await capture(
          `write ${parent}`,
          WRITE,
          { b: boardId, i: ids[parent], v: valuesFor(parent) },
          apiVersion,
        ),
      );
    }
    const afterReads = await readUntil(
      "after",
      apiVersion,
      (read) => r1Sum(read) !== cleanSum,
    );
    const after = afterReads.at(-1);

    const lastVersion = index === VERSIONS.length - 1;
    let clears = [];
    let restoreReads = [];
    if (!(LEAVE_VALUES && lastVersion)) {
      clears = await clearAll(apiVersion);
      restoreReads = await readUntil(
        "restore",
        apiVersion,
        (read) => r1Sum(read) === cleanSum,
      );
      dirty = r1Sum(restoreReads.at(-1)) !== cleanSum;
    }

    const beforeCells = cellsOf(before);
    const afterCells = cellsOf(after);
    const restoredCells = restoreReads.length
      ? cellsOf(restoreReads.at(-1))
      : {};
    for (const parent of PARENTS) {
      const subtree = [ids[parent], ...descendants(ids[parent])];
      for (const key of KEYS) {
        const { type, requestedFunction: fn, title } = fixture.columns[key];
        const leaves = leavesOf(parent, key);
        const own = PARENTS.filter((p) => subtree.includes(ids[p])).map((p) =>
          showWritten(HIDDEN[p][key]),
        );
        const row = {
          apiVersion,
          parent,
          column: title,
          function: fn,
          leaves,
          expectedPerDocs: rollup(type, fn, leaves),
          apiBefore: show(beforeCells[ids[parent]]?.[colId(key)]),
          ownValuesWritten: own,
          apiAfter: show(afterCells[ids[parent]]?.[colId(key)]),
          modelWithOwnValues: rollup(type, API_FN[type], [...leaves, ...own]),
          apiAfterClear: restoreReads.length
            ? show(restoredCells[ids[parent]]?.[colId(key)])
            : "not cleared",
        };
        row.verdict =
          row.apiAfter === row.apiBefore
            ? "unchanged by write"
            : row.apiAfter === row.modelWithOwnValues
              ? "DEVIATES: own values counted"
              : "DEVIATES: changed by write";
        comparisons.push(row);
      }
    }
    results.push({
      apiVersion,
      truth,
      meta,
      before,
      writes,
      afterReads,
      clears,
      restoreReads,
    });

    console.log(
      "\n  parent | column | expected per docs | API before | own values | API after | model with own values | after clear | verdict",
    );
    for (const r of comparisons.filter((c) => c.apiVersion === apiVersion)) {
      console.log(
        `  ${r.parent} | ${r.column} | ${r.expectedPerDocs} | ${r.apiBefore} | ${r.ownValuesWritten.join(", ")} | ${r.apiAfter} | ${r.modelWithOwnValues} | ${r.apiAfterClear} | ${r.verdict}`,
      );
    }
  }
} finally {
  if (dirty && !LEAVE_VALUES) {
    console.log("\nRestoring R1 and A after an incomplete run");
    await clearAll(VERSIONS.at(-1));
  }
  const out = JSON.stringify({ fixture, comparisons, results }, null, 2);
  if (out.includes(TOKEN))
    throw new Error("Refusing to write results: token found");
  writeFileSync(RESULTS_FILE, `${out}\n`);
  console.log(`\nWrote ${RESULTS_FILE}`);
  if (LEAVE_VALUES) {
    console.log(
      `Values left on R1 (${ids.R1}) and A (${ids.A}) of board ${boardId}; open it in the UI, then run teardown.mjs.`,
    );
  }
}
