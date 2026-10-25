#!/usr/bin/env node
/**
 * Creates the parent-stored-value fixture on any monday account: a new multi-level board,
 * seven rollup columns with explicit functions, and a three-level tree whose
 * leaves hold distinct values
 *
 *   R1 > A > A1 (11, 2026-03-02, 2026-03-01..03-10)
 *          > A2 (25, 2026-05-15, 2026-05-01..05-20)
 *      > B (100, 2026-01-10, 2026-01-05..01-12)
 *
 * R1 and A are parents and are created with no values. Node 18+, no
 * dependencies. Prints the board, column and item ids as JSON and writes
 * them to fixture-ids.json next to this script (or FIXTURE_IDS_FILE).
 *
 * Env:
 *   MONDAY_API_TOKEN     API token (sent only in the Authorization header)
 *   MONDAY_WORKSPACE_ID  workspace to create the board in
 *   EXPECT_ACCOUNT_SLUG  optional; refuse to run on any other account
 *   MONDAY_API_VERSION   optional; default 2026-10 (2026-04 rejects use_mls_template)
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

if (!TOKEN) throw new Error("MONDAY_API_TOKEN is not set");
if (!WORKSPACE_ID) throw new Error("MONDAY_WORKSPACE_ID is not set");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** One GraphQL request. Waits out complexity/rate budgets; any other error throws. */
const gql = async (query, variables = {}) => {
  for (let attempt = 1; attempt <= 6; attempt += 1) {
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
      await sleep(
        (Number(budget?.extensions?.retry_in_seconds ?? 20) + 1) * 1000,
      );
      continue;
    }
    if (body.errors || !body.data) {
      throw new Error(
        `HTTP ${res.status} request_id ${body.extensions?.request_id}: ${JSON.stringify(body.errors ?? body)}`,
      );
    }
    await sleep(1000);
    return body.data;
  }
  throw new Error("retries exhausted");
};

const me = await gql("query { me { account { slug } } }");
const slug = me.me.account.slug;
if (
  process.env.EXPECT_ACCOUNT_SLUG &&
  slug !== process.env.EXPECT_ACCOUNT_SLUG
) {
  throw new Error(
    `Refusing: token belongs to "${slug}", not "${process.env.EXPECT_ACCOUNT_SLUG}"`,
  );
}

const boardName = `G1 rollup repro ${new Date().toISOString()}`;
const board = await gql(
  "mutation ($n: String!, $w: ID!) { create_board(board_name: $n, board_kind: public, workspace_id: $w, use_mls_template: true, empty: true) { id name hierarchy_type } }",
  { n: boardName, w: WORKSPACE_ID },
);
const boardId = board.create_board.id;

const COLUMNS = [
  ["numSum", "Num SUM", "numbers", "SUM"],
  ["numMin", "Num MIN", "numbers", "MIN"],
  ["numMax", "Num MAX", "numbers", "MAX"],
  ["numNone", "Num NONE", "numbers", "NONE"],
  ["dateMin", "Date MIN", "date", "MIN"],
  ["dateMax", "Date MAX", "date", "MAX"],
  ["timeline", "Timeline", "timeline", "MIN_MAX"],
];
const columns = {};
for (const [key, title, type, fn] of COLUMNS) {
  const created = await gql(
    "mutation ($b: ID!, $t: String!, $ty: ColumnType!, $cap: ColumnCapabilitiesInput) { create_column(board_id: $b, title: $t, column_type: $ty, capabilities: $cap) { id title type capabilities { calculated { function } } } }",
    { b: boardId, t: title, ty: type, cap: { calculated: { function: fn } } },
  );
  columns[key] = {
    id: created.create_column.id,
    title,
    type,
    requestedFunction: fn,
    returnedFunction:
      created.create_column.capabilities?.calculated?.function ?? null,
  };
}

/** Column values for a leaf, keyed by column id. */
const leafValues = (n, date, from, to) =>
  JSON.stringify({
    [columns.numSum.id]: n,
    [columns.numMin.id]: n,
    [columns.numMax.id]: n,
    [columns.numNone.id]: n,
    [columns.dateMin.id]: { date },
    [columns.dateMax.id]: { date },
    [columns.timeline.id]: { from, to },
  });

const createItem = async (name) =>
  (
    await gql(
      "mutation ($b: ID!, $n: String!) { create_item(board_id: $b, item_name: $n) { id } }",
      { b: boardId, n: name },
    )
  ).create_item.id;

const createSubitem = async (parentId, name, values) =>
  (
    await gql(
      "mutation ($p: ID!, $n: String!, $v: JSON) { create_subitem(parent_item_id: $p, item_name: $n, column_values: $v) { id } }",
      { p: parentId, n: name, v: values },
    )
  ).create_subitem.id;

const R1 = await createItem("R1 root");
const A = await createSubitem(R1, "A (L2 parent)");
const A1 = await createSubitem(
  A,
  "A1 (L3 leaf)",
  leafValues(11, "2026-03-02", "2026-03-01", "2026-03-10"),
);
const A2 = await createSubitem(
  A,
  "A2 (L3 leaf)",
  leafValues(25, "2026-05-15", "2026-05-01", "2026-05-20"),
);
const B = await createSubitem(
  R1,
  "B (L2 leaf)",
  leafValues(100, "2026-01-10", "2026-01-05", "2026-01-12"),
);

const fixture = {
  account: slug,
  apiVersion: API_VERSION,
  createdAt: new Date().toISOString(),
  board: {
    id: boardId,
    name: board.create_board.name,
    hierarchy_type: board.create_board.hierarchy_type,
  },
  columns,
  items: { R1, A, A1, A2, B },
};
writeFileSync(OUT_FILE, `${JSON.stringify(fixture, null, 2)}\n`);
console.log(JSON.stringify(fixture, null, 2));
