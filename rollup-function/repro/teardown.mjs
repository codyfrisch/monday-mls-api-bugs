#!/usr/bin/env node
/**
 * Deletes the board setup-fixture.mjs created: only the board id in
 * fixture-ids.json. Node 18+, no dependencies.
 *
 * Env:
 *   MONDAY_API_TOKEN     API token (sent only in the Authorization header)
 *   EXPECT_ACCOUNT_SLUG  optional; refuse to run on any other account
 *   FIXTURE_IDS_FILE     optional; default ./fixture-ids.json beside this script
 *
 *   node teardown.mjs
 */
import { readFileSync } from "node:fs";

const API_URL = "https://api.monday.com/v2";
const TOKEN = process.env.MONDAY_API_TOKEN;
const FIXTURE_FILE =
  process.env.FIXTURE_IDS_FILE ??
  new URL("./fixture-ids.json", import.meta.url).pathname;

if (!TOKEN) throw new Error("MONDAY_API_TOKEN is not set");
const fixture = JSON.parse(readFileSync(FIXTURE_FILE, "utf8"));

const gql = async (query, variables = {}) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: TOKEN,
      "API-Version": "2026-10",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const body = await res.json();
  if (body.errors || !body.data) {
    throw new Error(`HTTP ${res.status}: ${JSON.stringify(body.errors ?? body)}`);
  }
  return body.data;
};

const me = await gql("query { me { account { slug } } }");
const slug = me.me.account.slug;
const expected = process.env.EXPECT_ACCOUNT_SLUG ?? fixture.account;
if (slug !== expected) {
  throw new Error(`Refusing: token belongs to "${slug}", not "${expected}"`);
}

const deleted = await gql(
  "mutation ($b: ID!) { delete_board(board_id: $b) { id } }",
  { b: fixture.board.id },
);
console.log(
  JSON.stringify({ account: slug, deletedBoard: deleted.delete_board.id }, null, 2),
);
