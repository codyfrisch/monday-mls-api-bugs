#!/usr/bin/env node
/**
 * Runs the subitems-shape cases C1–C8 against the board from setup-fixture.mjs and
 * compares each `subitems` list with the documented behaviour: every
 * descendant of the item, flattened. Read-only. Node 18+, no dependencies.
 *
 * Prints, per request: the request body, API-Version, status, x-request-id,
 * extensions.request_id, start/end timestamps, and expected vs observed
 * subitem ids. Writes every capture (request body, response headers and
 * body; never the token) to repro-results.json next to this script (or
 * REPRO_RESULTS_FILE).
 *
 * Env:
 *   MONDAY_API_TOKEN     API token (sent only in the Authorization header)
 *   MONDAY_API_VERSIONS  optional; comma-separated, default 2026-04,2026-10
 *   FIXTURE_IDS_FILE     optional; default ./fixture-ids.json beside this script
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

if (!TOKEN) throw new Error("MONDAY_API_TOKEN is not set");
const fixture = JSON.parse(readFileSync(FIXTURE_FILE, "utf8"));
const ids = fixture.items;
const boardId = fixture.board.id;

const SUBITEMS = "subitems { id name parent_item { id } }";
const ITEMS = `query ($ids: [ID!]) { items(ids: $ids) { id name ${SUBITEMS} } }`;
const CASES = [
  ["C1", "top-level item alone [R1]", ITEMS, { ids: [ids.R1] }],
  ["C2", "two top-level items [R1, R3]", ITEMS, { ids: [ids.R1, ids.R3] }],
  ["C3", "mid-level subitem alone [A]", ITEMS, { ids: [ids.A] }],
  ["C4", "subitem A2 alone [A2]", ITEMS, { ids: [ids.A2] }],
  ["C5", "mixed batch [R1, A]", ITEMS, { ids: [ids.R1, ids.A] }],
  ["C6", "mixed batch, reversed [A, R1]", ITEMS, { ids: [ids.A, ids.R1] }],
  [
    "C7",
    "items_page on the board",
    `query ($b: [ID!]) { boards(ids: $b) { items_page(limit: 50) { items { id name ${SUBITEMS} } } } }`,
    { b: [boardId] },
  ],
  [
    "C8",
    "nested subitems selection on [A]",
    "query ($ids: [ID!]) { items(ids: $ids) { id name subitems { id name parent_item { id } subitems { id name parent_item { id } subitems { id name } } } } }",
    { ids: [ids.A] },
  ],
];
const GROUND_TRUTH_PAGE =
  'query ($b: [ID!]) { boards(ids: $b) { items_page(limit: 500, hierarchy_scope_config: "allItems") { cursor items { id name parent_item { id } } } } }';
const GROUND_TRUTH =
  "query ($ids: [ID!]) { items(ids: $ids) { id name parent_item { id parent_item { id parent_item { id parent_item { id parent_item { id } } } } } } }";

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
const capture = async (caseId, query, variables, apiVersion) => {
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
  return {
    case: caseId,
    endpoint: API_URL,
    apiVersion,
    requestBody,
    startedAt,
    endedAt,
    status: res.status,
    xRequestId: headers["x-request-id"] ?? null,
    extensionsRequestId: responseBody?.extensions?.request_id ?? null,
    responseHeaders: headers,
    responseBodyRaw,
    responseBody,
  };
};

const parentsOf = (items) => {
  const parents = new Map();
  // A node whose parent_item was not selected (the last hop) says nothing about its parent.
  const walk = (node) => {
    if (!("parent_item" in node)) return;
    parents.set(node.id, node.parent_item?.id ?? null);
    if (node.parent_item) walk(node.parent_item);
  };
  for (const item of items) walk(item);
  return parents;
};

const descendantsOf = (parents, id) => {
  const children = [...parents].filter(([, p]) => p === id).map(([c]) => c);
  return [...children, ...children.flatMap((c) => descendantsOf(parents, c))];
};

const observe = (parents, item, path) => {
  if (!Array.isArray(item.subitems)) return [];
  const here = path ? `${path} > ${item.name}` : item.name;
  const observed = item.subitems.map((s) => s.id).sort();
  const expected = descendantsOf(parents, item.id).sort();
  const missing = expected.filter((id) => !observed.includes(id));
  const unexpected = observed.filter((id) => !expected.includes(id));
  const verdict = missing.length || unexpected.length ? "DEVIATES" : "PASS";
  return [
    { path: here, id: item.id, expected, observed, missing, unexpected, verdict },
    ...item.subitems.flatMap((s) => observe(parents, s, here)),
  ];
};

const results = [];
const allIds = Object.values(ids);
for (const apiVersion of VERSIONS) {
  if (results.length) await sleep(PAUSE_MS);
  const truth = await capture("ground-truth", GROUND_TRUTH, { ids: allIds }, apiVersion);
  results.push(truth);
  await sleep(PAUSE_MS);
  const page = await capture("ground-truth-all-items", GROUND_TRUTH_PAGE, { b: [boardId] }, apiVersion);
  results.push(page);
  // The board template seeds its own sample items; the allItems page puts them in the tree.
  const parents = parentsOf([
    ...(truth.responseBody?.data?.items ?? []),
    ...(page.responseBody?.data?.boards?.[0]?.items_page?.items ?? []),
  ]);
  console.log(`\n=== API-Version ${apiVersion} ===`);
  console.log(`ground truth (fixture ids): request_id ${truth.extensionsRequestId}, HTTP ${truth.status}`);
  console.log(`ground truth (allItems page): request_id ${page.extensionsRequestId}, HTTP ${page.status}, ${parents.size} items`);
  for (const [caseId, title, query, variables] of CASES) {
    await sleep(PAUSE_MS);
    const captured = await capture(caseId, query, variables, apiVersion);
    const data = captured.responseBody?.data;
    const items = data?.items ?? data?.boards?.[0]?.items_page?.items ?? [];
    const observations = items.flatMap((item) => observe(parents, item, ""));
    const verdict =
      captured.responseBody?.errors || !data
        ? "ERROR"
        : observations.some((o) => o.verdict === "DEVIATES")
          ? "DEVIATES"
          : "PASS";
    results.push({ ...captured, observations, verdict });
    console.log(`\n${caseId} ${title}: ${verdict}`);
    console.log(`  request body: ${captured.requestBody}`);
    console.log(
      `  HTTP ${captured.status}, x-request-id ${captured.xRequestId}, extensions.request_id ${captured.extensionsRequestId}`,
    );
    console.log(`  started ${captured.startedAt}, ended ${captured.endedAt}`);
    if (captured.responseBody?.errors) {
      console.log(`  errors: ${JSON.stringify(captured.responseBody.errors)}`);
    }
    for (const o of observations) {
      console.log(
        `  ${o.verdict} ${o.path} (${o.id}): expected [${o.expected.join(", ")}] observed [${o.observed.join(", ")}] missing [${o.missing.join(", ")}]`,
      );
    }
  }
}

const out = JSON.stringify({ fixture, results }, null, 2);
if (out.includes(TOKEN)) throw new Error("Refusing to write results: token found");
writeFileSync(RESULTS_FILE, `${out}\n`);
console.log(`\nWrote ${RESULTS_FILE}`);
