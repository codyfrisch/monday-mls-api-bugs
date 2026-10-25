# `subitems` on multi-level boards returns direct children, not all descendants

On a multi-level board, `subitems` returns every descendant of an item only
when every id in the request is a top-level item. A subitem's `subitems` are
its direct children. One subitem id anywhere in an `items(ids:)` request
switches every item in that response, top-level items included, to direct
children. monday's documentation says `subitems` returns all descendants,
flattened, regardless of depth.

The behaviour is identical at API-Version 2026-04 and 2026-10, on the
long-lived sandbox board and on a board created from scratch by
`repro/setup-fixture.mjs`.

Fixture tree (board "MLS Source", `hierarchy_type: multi_level`, account
`sandbox-account`; ids in `fixture.json`):

```text
R1 root
├── A (L2)
│   ├── A1 (L3 leaf)
│   └── A2 (L3)
│       └── A2x (L4)
│           └── A2y (L5 leaf)
└── B (L2 leaf)
R3 empty-child root
└── R3c (empty leaf)
```

The board also holds `R2 leaf root`, `DC deep-chain source`, and the
template's `Item 1 > Subitem Level 1 > Subitem Level 2 (×2)`. The tree is
established by `parent_item` only, never by `subitems` (requests
`02`, `03`, `12`, `13`).

## Expected behaviour per documentation

Every quote below is verbatim. The full extract, including the example
query and response, is [docs-quotes.md](docs-quotes.md). Pages were fetched
on 2026-10-24; the fetch tool returned no clock time.

### Q1. Working with multi-level boards: API changes table

URL: <https://developer.monday.com/api-reference/docs/working-with-multi-level-boards>
(page `updatedAt` 2026-09-06T08:33:47Z).
Heading path: Working with multi-level boards > API changes > Multi-level boards (table).

Row "All subitems are returned by `subitems` object, regardless of depth".
Classic boards column: "Same behaviour". How to mitigate: "Use the
`parent_item` field to calculate parent-child hierarchy."

### Q2. Working with multi-level boards: example callout

URL: <https://developer.monday.com/api-reference/docs/working-with-multi-level-boards>
(page `updatedAt` 2026-09-06T08:33:47Z).
Heading path: Working with multi-level boards > Example queries > Multi-level
board queries > Get items, subitems, and parent item relationship (info callout).

> "The `subitems` field returns **all** descendants of an item (flattened),
> not just direct children. Use the `parent_item` field on each subitem to
> determine its depth and reconstruct the tree."

Same section, intro:

> "This query gets items and their subitems. The `parent_item` field lets you
> reconstruct the hierarchy — subitems whose `parent_item` references another
> subitem are nested deeper in the tree."

The page's example queries `items_page` and shows a top-level item only. It
shows no subitem's own `subitems` and no request mixing top-level and
subitem ids.

### Q3. Items reference

URL: <https://developer.monday.com/api-reference/reference/items>
(page `updatedAt` 2026-09-06T08:36:01Z).
Heading path: Items > Queries > Get items > Fields.

- `subitems`: "The item's subitems."
- `ids` argument: "The IDs of the specific items, subitems, or parent items to return. Maximum of 100 IDs at one time using the `limit` argument."

The `ids` argument accepts subitem ids alongside parent item ids. Nothing
says that changes `subitems`.

### Q4. Subitems reference

URL: <https://developer.monday.com/api-reference/reference/subitems>
(page `updatedAt` 2026-09-06T08:31:48Z).
Heading path: Subitems > Queries > Get subitems > Fields.

- `subitems` (on a subitem): "The subitem's subitems."

### Q5. Release notes

URL: <https://developer.monday.com/api-reference/docs/release-notes>
(page `updatedAt` 2026-10-13T10:31:14Z).
Heading path: Release notes > 2025-04 > Hotfixes.

> "**February 27th, 2025:** We've introduced changes to the `subitems` query
> to help increase performance and return consistent results."

### What the documentation predicts per case

Q1 and Q2 are the only statements on depth. They predict that `subitems` of
any item is the full set of its descendants. Q3 and Q4 do not contradict
them. Q5 promises consistent results, which C5/C6 against C1/C3 violate.

| Case | Request | Predicted `subitems` (Q1, Q2) | Observed | Verdict |
|---|---|---|---|---|
| C1 | `items(ids: [R1])` | R1: A, A1, A2, A2x, A2y, B (6) | 6 | PASS |
| C2 | `items(ids: [R1, R3])` | R1: 6; R3: R3c (1) | 6; 1 | PASS |
| C3 | `items(ids: [A])` | A: A1, A2, A2x, A2y (4) | A1, A2 (2) | DEVIATES |
| C4 | `items(ids: [A2])` | A2: A2x, A2y (2) | A2x (1) | DEVIATES |
| C5 | `items(ids: [R1, A])` | R1: 6; A: 4 | R1: A, B (2); A: 2 | DEVIATES |
| C6 | `items(ids: [A, R1])` | R1: 6; A: 4 | R1: 2; A: 2 | DEVIATES |
| C7 | `boards { items_page(limit: 50) }` | each top-level item: all its descendants | all descendants | PASS |
| C8 | `items(ids: [A])`, `subitems` nested three deep | A: 4; A2: 2; A2x: A2y (1); A1: 0 | A: 2; A2: 1; A2x: 1; A1: 0 | DEVIATES |

C5 and C6 return different `subitems` for R1 than C1 does. The only change
is the extra id A in the request; its order does not matter. In C8, A2x's
`subitems` (A2y) matches the prediction only because A2x's sole descendant
is its direct child.

## Observed behaviour

[observed.md](observed.md) has, per case and API version, the expected and
observed id sets with names, the missing ids, `request_id`, `x-request-id`
and send time. Each run names its request file.

| Case | 2026-04 | 2026-10 | Request files |
|---|---|---|---|
| C1 | PASS | PASS | `captures/04-…`, `captures/14-…` |
| C2 | PASS | PASS | `captures/05-…`, `captures/15-…` |
| C3 | DEVIATES | DEVIATES | `captures/06-…`, `captures/16-…` |
| C4 | DEVIATES | DEVIATES | `captures/07-…`, `captures/17-…` |
| C5 | DEVIATES | DEVIATES | `captures/08-…`, `captures/18-…` |
| C6 | DEVIATES | DEVIATES | `captures/09-…`, `captures/19-…` |
| C7 | PASS | PASS | `captures/10-…`, `captures/20-…` |
| C8 | DEVIATES | DEVIATES | `captures/11-…`, `captures/21-…` |

Every request returned HTTP 200 with no `errors`. `extensions.request_id`
equals the `x-request-id` response header on every request.

The from-scratch run in `repro/sample-run/` produced the
same verdicts on a new board (`18436907623`, since deleted) at both versions.

## Documentation map

| URL | Title | Headings mentioning subitems |
|---|---|---|
| [docs/working-with-multi-level-boards](https://developer.monday.com/api-reference/docs/working-with-multi-level-boards) | Working with multi-level boards | "Get items, subitems, and parent item relationship"; "Get all items and subitems with hierarchy_scope_config" |
| [reference/items](https://developer.monday.com/api-reference/reference/items) | Items | none (field description only) |
| [reference/subitems](https://developer.monday.com/api-reference/reference/subitems) | Subitems | none (field description only) |
| [docs/release-notes](https://developer.monday.com/api-reference/docs/release-notes) | Release notes | "2025-04" > "Hotfixes" |
| [changelog/new-api-support-for-multi-level-boards](https://developer.monday.com/api-reference/changelog/new-api-support-for-multi-level-boards) | New API support for multi-level boards | none |

The Items and Subitems references describe the field only as "The item's
subitems." and "The subitem's subitems." No page documents what `subitems`
returns in a request that mixes top-level and subitem ids, or what a
subitem's own `subitems` returns.

## Bundle index

| File | What it is |
|---|---|
| `README.md` | This file. |
| `observed.md` | Per-case expected vs observed sets, missing ids, request ids, timestamps, verdicts. Generated from the captures. |
| `fixture.json` | Account slug and name, board id, name and `hierarchy_type`, every item with name, depth and parent id, columns touched (none). Generated from the captures. |
| `docs-quotes.md` | Verbatim documentation extract with URLs, heading paths and page `updatedAt`. |
| `captures/01-fixture-board-2026-04.json` | Request for account slug, board name and `hierarchy_type`. |
| `captures/02-ground-truth-items-2026-04.json` | Ground truth: `parent_item` chains (five hops) of every sandbox item. |
| `captures/03-ground-truth-all-items-2026-04.json` | Ground truth: every board item with `parent_item` via `hierarchy_scope_config: "allItems"`. |
| `captures/04-c1-top-level-alone-2026-04.json` | C1 at 2026-04. |
| `captures/05-c2-top-level-pair-2026-04.json` | C2 at 2026-04. |
| `captures/06-c3-mid-level-alone-2026-04.json` | C3 at 2026-04. |
| `captures/07-c4-a2-alone-2026-04.json` | C4 at 2026-04. |
| `captures/08-c5-mixed-2026-04.json` | C5 at 2026-04. |
| `captures/09-c6-mixed-reversed-2026-04.json` | C6 at 2026-04. |
| `captures/10-c7-items-page-2026-04.json` | C7 at 2026-04. |
| `captures/11-c8-nested-a-2026-04.json` | C8 at 2026-04. |
| `captures/12-ground-truth-items-2026-10.json` | As `02`, at 2026-10. |
| `captures/13-ground-truth-all-items-2026-10.json` | As `03`, at 2026-10. |
| `captures/14-…` to `captures/21-…-2026-10.json` | C1 to C8 at 2026-10, same order as `04`–`11`. |
| `repro/setup-fixture.mjs` | Standalone: creates a multi-level board and the fixture tree on any account. |
| `repro/run-repro.mjs` | Standalone: runs ground truth and C1–C8, prints and saves expected vs observed. |
| `repro/teardown.mjs` | Standalone: deletes the board named in `fixture-ids.json`. |
| `repro/sample-run/fixture-ids.json` | Board and item ids the setup run created. |
| `repro/sample-run/setup-output.txt` | Setup script stdout. |
| `repro/sample-run/repro-output.txt` | Repro script stdout, both API versions. |
| `repro/sample-run/repro-results.json` | Every repro capture (20 requests) with request body, headers, response and comparison. |
| `repro/sample-run/teardown-output.txt` | Teardown stdout: the deleted board id. |

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
| `FIXTURE_IDS_FILE` | all three | Optional, default `repro/fixture-ids.json`. |
| `REPRO_RESULTS_FILE` | repro | Optional, default `repro/repro-results.json`. |

```sh
cd repro
node setup-fixture.mjs   # creates board "R7 subitems repro <timestamp>" + 9 items; writes fixture-ids.json
node run-repro.mjs       # 10 read-only requests per API version; writes repro-results.json
node teardown.mjs        # deletes that board only
```

`setup-fixture.mjs` makes 11 requests (one `me` query, one `create_board`,
two `create_item`, seven `create_subitem`) with a 1 s pause after each. It
prints the board id, name, `hierarchy_type` and item ids as JSON. The
template seeds `Item 1` with three nested subitems even with `empty: true`;
`run-repro.mjs` reads every item via `allItems` so they enter the ground
truth.

Expected `run-repro.mjs` output at each API version: C1, C2 and C7 `PASS`;
C3, C4, C5, C6 and C8 `DEVIATES`, with these missing ids:

- C3 and C8 (A): A2x, A2y
- C4 and C8 (A > A2): A2y
- C5 and C6 (R1): A1, A2, A2x, A2y; (A): A2x, A2y
