# the API's parent rollup counts the parent's own stored value; the board does not

On a multi-level board, a write to a parent's own rollup cell returns
success, and from then on the API's rollup for that parent and every
ancestor includes the written value. This holds at every level and for every
rollup function: numbers SUM, MIN, MAX and NONE, date MIN and MAX, and
timeline MIN_MAX. The board UI ignores the stored value and computes each
parent from its leaves alone. monday's documentation says a parent's cell
holds "the summary of its child items", and that a write to it is either
blocked or accepted without changing the value.

The behaviour is identical at API-Version 2026-04 and 2026-10, on the
long-lived sandbox board and on a board created from scratch by
`repro/setup-fixture.mjs`. Clearing the written values with `null` restores
the API's rollup (R1 Num SUM back to 136).

Fixture tree (board "MLS Source", `hierarchy_type: multi_level`, account
`sandbox-account`; ids, leaf values and column ids in `fixture.json`):

```text
R1 root                      parent; own values written: 5 / 2 / 500 / 5 / 2020-01-01 / 2030-01-01 / 2020–2030
├── A (L2)                   parent; own values written: 1000 / 1 / 999 / 1000 / 2019-01-01 / 2031-01-01 / 2019–2031
│   ├── A1 (L3 leaf)         11, 2026-03-02, 2026-03-01 – 03-10
│   └── A2 (L3)              parent
│       └── A2x (L4)         parent
│           └── A2y (L5 leaf) 25, 2026-05-15, 2026-05-01 – 05-20
└── B (L2 leaf)              100, 2026-01-10, 2026-01-05 – 01-12
```

Own values are listed in column order Num SUM / Num MIN / Num MAX /
Num NONE / Date MIN / Date MAX / Timeline. Each leaf holds the same number in
all four Numbers columns and the same date in both Date columns. The board
also holds `R2 leaf root`, `R3 empty-child root > R3c`, `DC deep-chain
source`, and the template's `Item 1 > Subitem Level 1 > Subitem Level 2
(×2)`, none of which is under R1.

## Expected behaviour per documentation

Every quote below is verbatim. The full extract is
[docs-quotes.md](docs-quotes.md). Pages were fetched on 2026-10-24; the fetch
tool returned no clock time.

### Q1. A parent's cell is the summary of its children

URL: <https://developer.monday.com/api-reference/docs/working-with-multi-level-boards>
(page `updatedAt` 2026-09-06T08:33:47Z).
Heading path: Working with multi-level boards > Background > Rollup columns.

> "Columns with rollup can summarize the data in their child items. An
> individual rollup cell will either contain static data or summarize (roll
> up) the data of items below it. If an item is a parent, the cell will
> contain the summary of its child items. If the item has no children, the
> cell will contain a static value."

> "The `NONE` function disables rollup calculation on the column, while
> still keeping the capability metadata."

### Q2. `is_leaf: false` means a value calculated from children

Same page. Heading path: Working with multi-level boards > API changes >
Rollup columns (table, `is_leaf` row).

> "On multi-level boards with rollup columns: * `true` — the item has no
> subitems; the value is static. * `false` — the item has subitems; the value
> is a calculated rollup from child items."

Same page, Example queries > Rollup column queries > Distinguish static vs.
calculated values with is_leaf: the example response gives Campaign and
Phase 1 `{"number": 125, "is_leaf": false}`, Task A 100 and Task B 25, and
says:

> "\"Campaign\" and \"Phase 1\" show `is_leaf: false` — their values (125)
> are the sum of their children."

Timeline, same page and the Timeline reference
(<https://developer.monday.com/api-reference/reference/timeline>, `updatedAt`
2026-09-06T08:35:22Z):

> "The `MIN_MAX` function calculates the earliest `from` date and latest
> `to` date across all child items."

### Q3. A write to a parent's rollup cell: blocked, or success with no change

The documentation gives two different outcomes. Neither is a change to the
parent's value.

Blocked. Same page, API changes > Multi-level boards (table), row "Changing
column values (rollup columns)":

> "Blocked when the item has ≥1 subitem (parent cell is calculated)"

with mitigation "Remove all subitems to edit the parent (unblocks) or update
child items instead." The Columns reference
(<https://developer.monday.com/api-reference/reference/columns>, `updatedAt`
2026-09-06T08:35:36Z), Change column value:

> "For multi-level boards, rollup column changes are blocked if the item has
> at least one subitem."

Silent success. Same multi-level page, API changes > Rollup columns
(table, Mutations row), and Mutation behavior on rollup columns > Writing to
parent items (calculated cells):

> "Writing to a rollup cell on a parent item does **not** return an error.
> The API returns a success response, but the value is **not** changed — the
> calculated value remains. Update child items instead."

The Date reference (<https://developer.monday.com/api-reference/reference/date>,
`updatedAt` 2026-09-06T08:34:47Z) repeats it for dates: "mutations on parent
items with calculated rollup values **do not return an error** — the API
returns a success response, but the value is not changed."

### Q4. Becoming a parent clears the parent's values

Subitems reference (<https://developer.monday.com/api-reference/reference/subitems>,
`updatedAt` 2026-09-06T08:31:48Z), Create subitem callout:

> "When you create the first subitem under a parent: If no values are
> provided, the parent's values are copied to the subitem and then cleared
> from the parent."

The multi-level page's Converting between static and calculated says the
parent's rollup columns "become calculated — they now reflect the
sum/min/max/count of children." No page describes a parent that keeps a
stored value of its own, or says a rollup may include one.

### What the documentation predicts per case

Q1 and Q2 predict that each parent's value is the column's function over its
children, which for every function here equals the function over its
leaves. Q3 predicts that the writes are refused or change nothing, so the
values after the write equal those before it. Q4 says a parent holds no
stored value of its own.

| Parent | Column | Leaves | Predicted (Q1, Q2) | Predicted after the write (Q3) |
|---|---|---|---|---|
| R1 | Num SUM | 11, 25, 100 | 136 | 136 |
| R1 | Num MIN | 11, 25, 100 | 11 | 11 |
| R1 | Num MAX | 11, 25, 100 | 100 | 100 |
| R1 | Num NONE | 11, 25, 100 | no rollup (empty) | empty |
| R1 | Date MIN | 2026-01-10, 03-02, 05-15 | 2026-01-10 | 2026-01-10 |
| R1 | Date MAX | 2026-01-10, 03-02, 05-15 | 2026-05-15 | 2026-05-15 |
| R1 | Timeline | 01-05–01-12, 03-01–03-10, 05-01–05-20 | 2026-01-05 – 2026-05-20 | unchanged |
| A | Num SUM | 11, 25 | 36 | 36 |
| A | Num MIN | 11, 25 | 11 | 11 |
| A | Num MAX | 11, 25 | 25 | 25 |
| A | Num NONE | 11, 25 | no rollup (empty) | empty |
| A | Date MIN | 2026-03-02, 05-15 | 2026-03-02 | 2026-03-02 |
| A | Date MAX | 2026-03-02, 05-15 | 2026-05-15 | 2026-05-15 |
| A | Timeline | 03-01–03-10, 05-01–05-20 | 2026-03-01 – 2026-05-20 | unchanged |

## Observed behaviour

Both writes (`change_multiple_column_values` on R1, then on A) returned HTTP
200 with `data.change_multiple_column_values.id` and no `errors`, at both
versions. The values after the write moved by exactly the values written.

Observed at 2026-04 and 2026-10 (identical):

| Parent | Column | API before | API after | Own values in subtree | Model: leaves + own values | Board UI after the write |
|---|---|---|---|---|---|---|
| R1 | Num SUM | 136 | **1141** | 5, 1000 | 11+25+100+5+1000 = 1141 | 136 |
| R1 | Num MIN | 136 | **139** | 2, 1 | 136+2+1 = 139 (SUM) | 11 |
| R1 | Num MAX | 136 | **1635** | 500, 999 | 136+500+999 = 1635 (SUM) | 100 |
| R1 | Num NONE | 136 | **1141** | 5, 1000 | 1141 (SUM) | empty |
| R1 | Date MIN | 2026-01-10 | **2019-01-01** | 2020-01-01, 2019-01-01 | min = 2019-01-01 | Jan 10 |
| R1 | Date MAX | 2026-01-10 | 2026-01-10 | 2030-01-01, 2031-01-01 | min = 2026-01-10 | May 15 |
| R1 | Timeline | 2026-01-05 – 2026-05-20 | **2019-01-01 – 2031-01-01** | 2020–2030, 2019–2031 | 2019-01-01 – 2031-01-01 | Jan 5 – May 20 |
| A | Num SUM | 36 | **1036** | 1000 | 1036 | 36 |
| A | Num MIN | 36 | **37** | 1 | 37 (SUM) | 11 |
| A | Num MAX | 36 | **1035** | 999 | 1035 (SUM) | 25 |
| A | Num NONE | 36 | **1036** | 1000 | 1036 (SUM) | empty |
| A | Date MIN | 2026-03-02 | **2019-01-01** | 2019-01-01 | 2019-01-01 | Mar 2 |
| A | Date MAX | 2026-03-02 | 2026-03-02 | 2031-01-01 | min = 2026-03-02 | May 15 |
| A | Timeline | 2026-03-01 – 2026-05-20 | **2019-01-01 – 2031-01-01** | 2019–2031 | 2019-01-01 – 2031-01-01 | Mar 1 – May 20 |

R1's values include both R1's own value and A's own value: the API counts a
stored value at the parent's own level and at every parent level below it.
Every observed value after the write equals the model "the API's function
over the leaves plus every own value in the subtree". Every value after the
clear equals the value before the write.

The model uses SUM for every Numbers column and MIN for both Date columns,
because that is what the API returns before any write (Num MIN, MAX and NONE
read 136 on R1, Date MAX reads 2026-01-10). That function mismatch is a
separate issue, documented in [`../rollup-function/`](../rollup-function/).
It also explains the Date MAX rows: the API applies MIN, so the late dates
written (2030, 2031) cannot move it, and the value stays at 2026-01-10. This
issue is the inclusion of the own values. It shows on the SUM column, where
the function mismatch plays no part (136 → 1141 = 136 + 5 + 1000), and on
Date MIN and Timeline, whose functions the API does apply.

Request ids for the key requests:

| Request | 2026-04 | 2026-10 |
|---|---|---|
| Before | `captures/04-…` `f4e69575-4bc3-9d56-9cda-e40580814b67` | `captures/13-…` `b6533f54-d0e6-9f5a-b386-88336ada7a2e` |
| Write R1 | `captures/05-…` `8252c5ad-7290-934b-bf9e-66bcf8db6a59` | `captures/14-…` `446f62bb-e161-9c0b-9d6b-0d168896899a` |
| Write A | `captures/06-…` `9301c9c4-4f81-9799-bcb6-c418e7e95b9b` | `captures/15-…` `7effcbe4-7c30-936c-8da3-6105861abed4` |
| After | `captures/07-…` `2a6d587c-9970-9309-9d41-5f95953c9867` | `captures/16-…` `544c4d8f-2753-94bf-9de0-1493bb0e411a` |
| Clear R1 | `captures/08-…` `2d700e70-1880-9ba2-b3af-16132e26ef58` | `captures/17-…` `195de513-1d74-9301-b30d-a44b14b19a9d` |
| Clear A | `captures/09-…` `d2b84514-c353-9a56-ace3-32fb619e4c30` | `captures/18-…` `7f0aee59-ef28-92b5-b360-4bed26e0d437` |
| Restore | `captures/10-…` `ddf90549-3e4c-91a2-b314-780d43d6e158` | `captures/19-…` `e4523244-cc65-9885-9aee-a44424707f15` |

All requests were sent on 2026-10-25 between 02:41:16Z and 02:41:53Z.
[observed.md](observed.md) has, per API version, every parent × column with
leaves, expected value, board UI value, before, own values, after, model,
the value after the clear, the column metadata and every request's
`request_id` and send time. Every request returned HTTP 200 with no
`errors`, and `extensions.request_id` equals the `x-request-id` response
header on every request.

The from-scratch run in `repro/sample-run/` produced the
same numbers on a new board (`18436908272`, since deleted) with a three-level
tree (R1 > A > A1, A2; R1 > B) and the same leaf values, at both versions.
Its write request ids are `e75e82f2-a868-94c7-9e55-1a56c8ee5ad0` (R1) and
`9b84df5e-1e99-91aa-bb5c-3e88d20007f9` (A) at 2026-04,
`fd903191-ae38-96b7-812b-f57d6fc539b9` and
`98540436-5561-9c73-8b71-387352cee725` at 2026-10; the after reads are
`26675988-d51e-9b2e-8116-4004565b7bd9` and
`08aad4fe-98dd-90d2-ad12-ba5394a742ec`.

## Board UI evidence

Source: a screenshot of the "MLS Source" board taken on 2026-10-24, after
the same values were written to R1 and A by an earlier run of the same
mutation (write at 2026-10-24T14:13:24.992Z). The reading is recorded in
`fixture.json` under `boardUi`; the screenshot itself is not in this
repository. At that moment the API read
R1 as 1141 / 139 / 1635 / 1141 / 2019-01-01 / 2026-01-10 / 2019-01-01 –
2031-01-01, the same values this bundle captured.

| Column | R1 on the board | A on the board |
|---|---|---|
| Num SUM | 136 | 36 |
| Num MIN | 11 | 11 |
| Num MAX | 100 | 25 |
| Num NONE | empty | empty |
| Date MIN | Jan 10 | Mar 2 |
| Date MAX | May 15 | May 15 |
| Timeline | Jan 5 – May 20 | Mar 1 – May 20 |

The group footer's Num SUM read 143 (R1 136 + R2 7). Every board value is
the column's function over the leaves, as Q1 and Q2 describe; none moved
after the write. The board and the API disagree on the same cell at the same
time.

### How monday can verify in the UI

1. Run `repro/setup-fixture.mjs`, then `REPRO_LEAVE_VALUES=1 node
   run-repro.mjs`. The last API version's write is not cleared, and the
   script prints the board id.
2. Open the board in the UI and expand R1 and A. R1 shows Num SUM 136, Num
   MIN 11, Num MAX 100, Num NONE empty, Date MIN Jan 10, Date MAX May 15,
   Timeline Jan 5 – May 20.
3. In the same minute, read R1 with `items(ids: [<R1>]) { column_values(capabilities: [CALCULATED]) { ... } }`.
   It returns 1141, 139, 1635, 1141, 2019-01-01, 2026-01-10 and 2019-01-01 –
   2031-01-01.
4. Run `teardown.mjs` to delete the board.

The own values are not visible anywhere in the UI. The only trace of them is
the API's rollup.

## Documentation map

| URL | Title | `updatedAt` | Rollup content |
|---|---|---|---|
| [docs/working-with-multi-level-boards](https://developer.monday.com/api-reference/docs/working-with-multi-level-boards) | Working with multi-level boards | 2026-09-06T08:33:47Z | Background > Rollup columns (Q1); API changes tables (Q2, Q3 both outcomes); Rollup column queries (125 example); Creating columns; Mutation behavior on rollup columns (Q3, Q4) |
| [reference/subitems](https://developer.monday.com/api-reference/reference/subitems) | Subitems | 2026-09-06T08:31:48Z | First subitem copies then clears the parent's values (Q4) |
| [reference/columns](https://developer.monday.com/api-reference/reference/columns) | Columns | 2026-09-06T08:35:36Z | Rollup changes blocked on parents (Q3); empty `capabilities` |
| [reference/columns-other-types](https://developer.monday.com/api-reference/reference/columns-other-types) | Other types | 2026-09-06T08:35:36Z | `CalculatedFunction` enum; "The function to calculate the parent values." |
| [reference/date](https://developer.monday.com/api-reference/reference/date) | Date | 2026-09-06T08:34:47Z | `is_leaf`; silent success on parents (Q3) |
| [reference/timeline](https://developer.monday.com/api-reference/reference/timeline) | Timeline | 2026-09-06T08:35:22Z | `MIN_MAX` over child items |
| reference/numbers | none | none | HTTP 404 |

Contradictions inside the documentation:

- **Blocked vs. silent success.** The multi-level page's Multi-level boards
  table and the Columns reference say a rollup change on a parent is
  "Blocked". The same multi-level page's Rollup columns table, its Mutation
  behavior section and the Date reference say it "does **not** return an
  error" and "the value is **not** changed". Observed: neither. The write
  succeeds and the API's value changes.
- **Empty `capabilities`.** The multi-level page (Creating columns with
  rollup capabilities) says "Passing an empty `capabilities: {}` does
  **not** disable rollup on multi-level boards". The Columns reference
  (create_column / update_column, `capabilities` argument) says "To override
  this default on multi-level boards, pass an empty argument to create the
  column without capabilities." Not exercised here; `repro/setup-fixture.mjs`
  passes an explicit function for every column.
- **Column metadata at 2026-04.** `boards { columns(ids: [...]) }` returns
  `[]` for all seven rollup columns at 2026-04 (`captures/03-…`) and all seven with
  their functions at 2026-10 (`captures/12-…`). No page says rollup columns are
  hidden from `columns` at 2026-04.

## Bundle index

| File | What it is |
|---|---|
| `README.md` | This file. |
| `observed.md` | Per version: column metadata, write and clear responses, read request ids, and every parent × column with expected, board UI, before, own values, after, model, after-clear and verdict. Generated from the captures. |
| `fixture.json` | Account, board id, name and `hierarchy_type`; every item with name, depth, parent id, leaf flag and its seven rollup cells as read before the write; column ids, types and functions (declared, and as returned at each version); the own values written; the board UI reading. Generated from the captures. |
| `docs-quotes.md` | Verbatim documentation extract with URLs, heading paths and page `updatedAt`. |
| `captures/01-fixture-board-2026-04.json` | Account slug, board name and `hierarchy_type`. |
| `captures/02-ground-truth-2026-04.json` | Every board item (`hierarchy_scope_config: "allItems"`) with `parent_item` and its seven cells read with `capabilities: [CALCULATED]`. |
| `captures/03-column-metadata-2026-04.json` | `columns(ids:)` with `capabilities { calculated { function } }`; returns `[]`. |
| `captures/04-before-2026-04.json` | R1 and A, clean. |
| `captures/05-write-r1-2026-04.json`, `captures/06-write-a-2026-04.json` | `change_multiple_column_values` of the own values to R1, then A. |
| `captures/07-after-2026-04.json` | R1 and A after the writes. |
| `captures/08-clear-r1-2026-04.json`, `captures/09-clear-a-2026-04.json` | The same mutation with `null` for each column. |
| `captures/10-restore-2026-04.json` | R1 and A after the clear. |
| `captures/11-…` to `captures/19-…-2026-10.json` | As `02`–`10`, at 2026-10. |
| `repro/setup-fixture.mjs` | Standalone: creates a multi-level board, the seven rollup columns and the tree on any account. |
| `repro/run-repro.mjs` | Standalone: reads clean, writes the own values, reads, clears, reads; prints and saves expected vs observed. |
| `repro/teardown.mjs` | Standalone: deletes the board named in `fixture-ids.json`, only if its name starts with "G1 rollup repro". |
| `repro/sample-run/fixture-ids.json` | Board, column and item ids the setup run created. |
| `repro/sample-run/setup-output.txt` | Setup stdout. |
| `repro/sample-run/repro-output.txt` | Repro stdout, both API versions. |
| `repro/sample-run/repro-results.json` | Every repro capture (18 requests) with request body, headers and response, and the comparison rows. |
| `repro/sample-run/teardown-output.txt` | Teardown stdout: the deleted board id and name. |

Each request file holds: `endpoint`, `requestHeaders` (API-Version and
Content-Type; the Authorization header was sent and is not recorded),
`requestBody` (the exact string sent), `query`, `variables`, `startedAt` and
`endedAt` (ISO UTC, ms), `status`, `xRequestId`, `rateLimitHeaders`
(`ratelimit`, `ratelimit-policy`), `responseHeaders` (only `api-version`, `content-type`, `date`, `ratelimit`, `ratelimit-policy` and `x-request-id`; every other response header was removed before publication),
`extensionsRequestId`, `responseBodyRaw` and the parsed `responseBody`. No file contains the token.

## Reproduce

### Standalone, on any monday account

Prerequisites: Node 18 or newer, an API token for a user who can create
boards in the target workspace. No packages to install. Every request is a
plain `fetch` to `https://api.monday.com/v2`.

Env vars:

| Name | Used by | Meaning |
|---|---|---|
| `MONDAY_API_TOKEN` | all three | API token. Sent only in the Authorization header; never printed or saved. |
| `MONDAY_WORKSPACE_ID` | setup | Workspace to create the board in. |
| `EXPECT_ACCOUNT_SLUG` | setup, teardown | Optional. Refuse to run unless the token's account has this slug. |
| `MONDAY_API_VERSION` | setup | Optional, default `2026-10`. `2026-04` rejects `create_board(use_mls_template:)`. |
| `MONDAY_API_VERSIONS` | repro | Optional, default `2026-04,2026-10`. |
| `REPRO_LEAVE_VALUES` | repro | Optional. `1` leaves the last version's written values on the board for a UI check. |
| `FIXTURE_IDS_FILE` | all three | Optional, default `repro/fixture-ids.json`. |
| `REPRO_RESULTS_FILE` | repro | Optional, default `repro/repro-results.json`. |

```sh
cd repro
node setup-fixture.mjs   # board "G1 rollup repro <timestamp>", 7 rollup columns, 5 items; writes fixture-ids.json
node run-repro.mjs       # 9 requests per API version (4 of them mutations on R1 and A); writes repro-results.json
node teardown.mjs        # deletes that board only
```

`setup-fixture.mjs` makes 15 requests (one `me` query, one `create_board`,
seven `create_column` with `capabilities: {calculated: {function: …}}`, one
`create_item`, five `create_subitem`) with a 1 s pause after each. R1 and A
are created with no values; the leaves get their values in
`create_subitem(column_values:)`. The template seeds `Item 1 > Subitem
Level 1 > Subitem Level 2 (×2)` even with `empty: true`; they are not under
R1, and `run-repro.mjs` reads every item via `allItems` so they enter the
ground truth. `run-repro.mjs` refuses to write unless R1's Num SUM first
reads the sum of its leaves, and clears R1 and A in a `finally` block.

Expected `run-repro.mjs` output at each API version: every Numbers row,
Date MIN and Timeline `DEVIATES: own values counted`, with the values in the
Observed table above; Date MAX `unchanged by write`; every after-clear value
equal to the before value.
