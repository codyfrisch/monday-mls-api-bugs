#!/usr/bin/env node
/**
 * Creates the rollup-function fixture on any monday account: a new multi-level board with
 * one rollup column per function and a 3-level tree whose leaves carry
 * values chosen so SUM, MIN and MAX all differ and the earliest and latest
 * dates differ.
 *
 *   P1 (L1 parent)
 *   ├── Q1 (L2 parent)
 *   │   ├── Q1a (L3 leaf)
 *   │   └── Q1b (L3 leaf)
 *   └── P1c (L2 leaf)
 *
 * Only leaves are written; parents never receive a value. Items are created
 * empty first, then each leaf is written once, so no first-subitem copy
 * moves a value between levels. Waits 10 s after the last write so monday
 * can recalculate the rollups.
 *
 * Node 18+, no dependencies. Prints the board, column and item ids as JSON
 * and writes them to fixture-ids.json next to this script (or
 * FIXTURE_IDS_FILE).
 *
 * Env:
 *   MONDAY_API_TOKEN     API token (sent only in the Authorization header)
 *   MONDAY_WORKSPACE_ID  workspace to create the board in
 *   EXPECT_ACCOUNT_SLUG  optional; refuse to run on any other account
 *   MONDAY_API_VERSION   optional; default 2026-10 (2026-04 rejects use_mls_template)
 *   FIXTURE_IDS_FILE     optional; default ./fixture-ids.json beside this script
 *
 *   node setup-fixture.mjs
 */
import { writeFileSync } from "node:fs";

const API_URL = "https://api.monday.com/v2";
const TOKEN = process.env.MONDAY_API_TOKEN;
const WORKSPACE_ID = process.env.MONDAY_WORKSPACE_ID;
const API_VERSION = process.env.MONDAY_API_VERSION ?? "2026-10";
const OUT_FILE =
  process.env.FIXTURE_IDS_FILE ??
  new URL("./fixture-ids.json", import.meta.url).pathname;
const RECALC_WAIT_MS = 10_000;

if (!TOKEN) throw new Error("MONDAY_API_TOKEN is not set");
if (!WORKSPACE_ID) throw new Error("MONDAY_WORKSPACE_ID is not set");

/** Rollup columns: one per function, plus a date column left on its default. */
const COLUMNS = [
  { key: "numSum", title: "Num SUM", type: "numbers", fn: "SUM" },
  { key: "numMin", title: "Num MIN", type: "numbers", fn: "MIN" },
  { key: "numMax", title: "Num MAX", type: "numbers", fn: "MAX" },
  { key: "numNone", title: "Num NONE", type: "numbers", fn: "NONE" },
  { key: "dateMin", title: "Date MIN", type: "date", fn: "MIN" },
  { key: "dateMax", title: "Date MAX", type: "date", fn: "MAX" },
  { key: "dateNone", title: "Date NONE", type: "date", fn: "NONE" },
  { key: "dateDefault", title: "Date default", type: "date", fn: null },
  { key: "timeline", title: "Timeline MIN_MAX", type: "timeline", fn: "MIN_MAX" },
];

/**
 * Leaf values. Q1: SUM 47, MIN 7, MAX 40; dates 2026-03-03..2026-06-30.
 * P1: SUM 247, MIN 7, MAX 200; dates 2026-01-20..2026-06-30.
 */
const LEAVES = {
  Q1a: { number: 40, date: "2026-03-03", timeline: { from: "2026-03-01", to: "2026-03-20" } },
  Q1b: { number: 7, date: "2026-06-30", timeline: { from: "2026-05-01", to: "2026-07-15" } },
  P1c: { number: 200, date: "2026-01-20", timeline: { from: "2026-01-10", to: "2026-02-01" } },
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * One GraphQL request. Waits out complexity/rate budgets. Returns
 * `{ data, errors, requestId, status }`; the caller decides whether an error
 * is fatal.
 */
const gql = async (query, variables = {}) => {
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    const startedAt = new Date().toISOString();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: TOKEN,
        "API-Version": API_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });
    const body = await res.json().catch(() => ({}));
    const budget = (body.errors ?? []).find((e) =>
      ["COMPLEXITY_BUDGET_EXHAUSTED", "RATE_LIMIT_EXCEEDED"].includes(
        e.extensions?.code,
      ),
    );
    if (res.status === 429 || budget) {
      await sleep((Number(budget?.extensions?.retry_in_seconds ?? 20) + 1) * 1000);
      continue;
    }
    await sleep(1000);
    return {
      data: body.data ?? null,
      errors: body.errors ?? null,
      requestId: body.extensions?.request_id ?? res.headers.get("x-request-id"),
      status: res.status,
      startedAt,
    };
  }
  throw new Error("retries exhausted");
};

/** {@link gql}, throwing on any error. */
const must = async (label, query, variables) => {
  const result = await gql(query, variables);
  console.error(`${label}: HTTP ${result.status}, request_id ${result.requestId}, sent ${result.startedAt}`);
  if (result.errors || !result.data) {
    throw new Error(`${label} failed: ${JSON.stringify(result.errors)}`);
  }
  return result.data;
};

const me = await must("me", "query { me { account { slug } } }");
const slug = me.me.account.slug;
if (process.env.EXPECT_ACCOUNT_SLUG && slug !== process.env.EXPECT_ACCOUNT_SLUG) {
  throw new Error(
    `Refusing: token belongs to "${slug}", not "${process.env.EXPECT_ACCOUNT_SLUG}"`,
  );
}

const boardName = `R4 rollup function repro ${new Date().toISOString()}`;
const board = (
  await must(
    "create_board",
    `mutation ($n: String!, $w: ID!) { create_board(board_name: $n, board_kind: public, workspace_id: $w, use_mls_template: true, empty: true) { id name hierarchy_type } }`,
    { n: boardName, w: WORKSPACE_ID },
  )
).create_board;
const boardId = board.id;

const columns = {};
for (const spec of COLUMNS) {
  const result = await gql(
    `mutation ($b: ID!, $t: String!, $ty: ColumnType!, $cap: ColumnCapabilitiesInput) { create_column(board_id: $b, title: $t, column_type: $ty, capabilities: $cap) { id title type capabilities { calculated { function } } } }`,
    {
      b: boardId,
      t: spec.title,
      ty: spec.type,
      cap: spec.fn ? { calculated: { function: spec.fn } } : undefined,
    },
  );
  console.error(
    `create_column ${spec.title}: HTTP ${result.status}, request_id ${result.requestId}, sent ${result.startedAt}${result.errors ? ` ERROR ${JSON.stringify(result.errors)}` : ""}`,
  );
  columns[spec.key] = result.data?.create_column
    ? {
        id: result.data.create_column.id,
        title: spec.title,
        type: spec.type,
        requestedFunction: spec.fn,
        createdFunction: result.data.create_column.capabilities?.calculated?.function ?? null,
        requestId: result.requestId,
      }
    : {
        id: null,
        title: spec.title,
        type: spec.type,
        requestedFunction: spec.fn,
        error: result.errors,
        requestId: result.requestId,
      };
}

const createItem = async (name) =>
  (
    await must(
      `create_item ${name}`,
      `mutation ($b: ID!, $n: String!) { create_item(board_id: $b, item_name: $n) { id } }`,
      { b: boardId, n: name },
    )
  ).create_item.id;

const createSubitem = async (parentId, name) =>
  (
    await must(
      `create_subitem ${name}`,
      `mutation ($p: ID!, $n: String!) { create_subitem(parent_item_id: $p, item_name: $n) { id } }`,
      { p: parentId, n: name },
    )
  ).create_subitem.id;

const P1 = await createItem("P1 (L1 parent)");
const Q1 = await createSubitem(P1, "Q1 (L2 parent)");
const Q1a = await createSubitem(Q1, "Q1a (L3 leaf)");
const Q1b = await createSubitem(Q1, "Q1b (L3 leaf)");
const P1c = await createSubitem(P1, "P1c (L2 leaf)");
const items = { P1, Q1, Q1a, Q1b, P1c };

/** column id → value for one leaf, over every column that was created. */
const leafColumnValues = (leaf) =>
  Object.fromEntries(
    Object.values(columns)
      .filter((col) => col.id)
      .map((col) => [
        col.id,
        col.type === "numbers"
          ? String(leaf.number)
          : col.type === "date"
            ? { date: leaf.date }
            : leaf.timeline,
      ]),
  );

for (const [key, leaf] of Object.entries(LEAVES)) {
  await must(
    `write leaf ${key}`,
    `mutation ($b: ID!, $i: ID!, $v: JSON!) { change_multiple_column_values(board_id: $b, item_id: $i, column_values: $v) { id } }`,
    { b: boardId, i: items[key], v: JSON.stringify(leafColumnValues(leaf)) },
  );
}
const lastWriteAt = new Date().toISOString();
console.error(`waiting ${RECALC_WAIT_MS / 1000} s for rollup recalculation`);
await sleep(RECALC_WAIT_MS);

const fixture = {
  account: slug,
  apiVersion: API_VERSION,
  createdAt: new Date().toISOString(),
  lastWriteAt,
  board: { id: boardId, name: board.name, hierarchy_type: board.hierarchy_type },
  columns,
  items,
  parents: { P1: ["Q1", "P1c"], Q1: ["Q1a", "Q1b"] },
  leafValues: LEAVES,
};
writeFileSync(OUT_FILE, `${JSON.stringify(fixture, null, 2)}\n`);
console.log(JSON.stringify(fixture, null, 2));
