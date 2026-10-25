# a parent's rollup value ignores the column's configured function

On a multi-level board, the API computes every parent's Numbers rollup as
SUM and every Date rollup as MIN (earliest), whatever function the column is
configured with. Column metadata reports the configured function
(`capabilities.calculated.function` is `MIN`, `MAX` or `NONE`), and the board
UI shows that function's result. A Numbers column set to `NONE` still
returns the SUM on every parent. Timeline (`MIN_MAX`) is correct.

The behaviour is identical at API-Version 2026-04 and 2026-10, on a board
created from scratch for this bundle and on the long-lived sandbox board. It
holds at every parent depth tested (L1 to L4) and on a re-read 10 s later.
Leaves return their own written value with `is_leaf: true`.

Fresh-board fixture (board `18436908354`, `hierarchy_type: multi_level`,
account `sandbox-account`; ids in `fixture.json`). Only the three leaves were
written; no parent received a value.

```text
P1 (L1 parent)
├── Q1 (L2 parent)
│   ├── Q1a (L3 leaf)   number 40   date 2026-03-03   timeline 2026-03-01..2026-03-20
│   └── Q1b (L3 leaf)   number 7    date 2026-06-30   timeline 2026-05-01..2026-07-15
└── P1c (L2 leaf)       number 200  date 2026-01-20   timeline 2026-01-10..2026-02-01
```

Each leaf carries the same number in all four Numbers columns and the same
date in every Date column, so the columns differ only in their function.
Q1's children give SUM 47, MIN 7, MAX 40. P1's leaves give SUM 247, MIN 7,
MAX 200. The template also seeds `Item 1 > Subitem Level 1 > Subitem Level 2
(×2)` with no values; they are in the ground truth and in no comparison.

| Column | Configured function (metadata) | Q1 expected | Q1 observed | P1 expected | P1 observed | Observed matches |
|---|---|---|---|---|---|---|
| Num SUM | SUM | 47 | 47 | 247 | 247 | SUM |
| Num MIN | MIN | 7 | **47** | 7 | **247** | SUM |
| Num MAX | MAX | 40 | **47** | 200 | **247** | SUM |
| Num NONE | NONE | empty | **47** | empty | **247** | SUM |
| Date MIN | MIN | 2026-03-03 | 2026-03-03 | 2026-01-20 | 2026-01-20 | MIN |
| Date MAX | MAX | 2026-06-30 | **2026-03-03** | 2026-06-30 | **2026-01-20** | MIN |
| Date default | MIN (created without `capabilities`) | 2026-03-03 | 2026-03-03 | 2026-01-20 | 2026-01-20 | MIN |
| Timeline MIN_MAX | MIN_MAX | 2026-03-01..2026-07-15 | same | 2026-01-10..2026-07-15 | same | MIN_MAX |

Same values at 2026-04 and 2026-10, first read and re-read.

Two related deviations from the documentation, recorded here and not part
of the main report:

- A Date column created with no `capabilities` argument reports function
  `MIN`. The documentation says the Date default is `MAX` (Q1, Q6).
- `create_column(column_type: date, capabilities: {calculated: {function:
  NONE}})` fails with `INVALID_INPUT`: "Invalid calculated function 'none'
  for column type 'date'. Valid functions: min, max"
  (`captures/09-create-column-datenone-2026-10.json`). The documentation lists `NONE`
  as a supported Date function (Q1).

## Expected behaviour per documentation

Every quote below is verbatim. The full extract is
[docs-quotes.md](docs-quotes.md). Pages were fetched on 2026-10-24; the
fetch tool returned no clock time.

### Q1. Supported column types and rollup functions

URL: <https://developer.monday.com/api-reference/docs/working-with-multi-level-boards>
(page `updatedAt` 2026-09-06T08:33:47Z).
Heading path: Working with multi-level boards > Background > Rollup columns >
Supported column types and rollup functions.

| Column type | Supported functions | Default function |
|---|---|---|
| `numbers` | `SUM`, `MIN`, `MAX`, `NONE` | `SUM` |
| `date` | `MIN`, `MAX`, `NONE` | `MAX` |
| `timeline` | `MIN_MAX`, `NONE` | `MIN_MAX` |
| `status` | `COUNT_KEYS`, `NONE` | `COUNT_KEYS` |

Same section:

> "The `NONE` function disables rollup calculation on the column, while
> still keeping the capability metadata."

### Q2. Rollup column metadata

Same URL and `updatedAt`. Heading path: Working with multi-level boards >
Example queries > Rollup column queries > Get rollup column metadata.

> "The `function` field returns the active rollup function (e.g., `SUM`,
> `MIN`, `MAX`, `MIN_MAX`, `COUNT_KEYS`, `NONE`)."

API changes > Rollup columns table, `capabilities` row:

> "Use it to see the aggregation function used by the column (e.g., `SUM`,
> `MIN`, `COUNT_KEYS`, etc)."

### Q3. Converting between static and calculated

Same URL and `updatedAt`. Heading path: Working with multi-level boards >
Mutation behavior on rollup columns > Converting between static and
calculated.

> "The parent's rollup columns become calculated — they now reflect the
> sum/min/max/count of children."

### Q4. CalculatedCapability

URL: <https://developer.monday.com/api-reference/reference/columns-other-types>
(page `updatedAt` 2026-09-06T08:35:36Z). Heading path: Other types >
CalculatedCapability > Fields.

- `function`: "The function to calculate the parent values."

`CalculatedFunction` enum: `COUNT_KEYS`, `MAX`, `MIN`, `MIN_MAX`, `NONE`,
`SUM`. "The function to count the values. If not provided, the default
column type function will apply."

### Q5. Timeline

URL: <https://developer.monday.com/api-reference/reference/timeline>
(page `updatedAt` 2026-09-06T08:35:22Z).

> "The `MIN_MAX` function calculates the earliest `from` date and latest
> `to` date across all child items."

### Q6. Date

URL: <https://developer.monday.com/api-reference/reference/date>
(page `updatedAt` 2026-09-06T08:34:47Z).

> "On multi-level boards, date columns are created with `MAX` rollup by
> default."

Settings, `calcType`: "Calculation type for date aggregation. One of
`earliestToLatest`, `earliest`, or `latest`." No page relates `calcType` to
the rollup function. Every Date column in this bundle, fresh and sandbox,
returns `settings: {}` and `settings_str: "{}"` at both versions, so no
`calcType` is set that could override the function.

### What the documentation predicts per case

Q1, Q2 and Q4 say the column's function is the one that calculates the
parent value and that metadata reports it. Q3 says a parent reflects the
sum, min or max of its children. So a parent's value is the configured
function applied to its children; `NONE` gives no calculated value.

| Column function | Prediction for a parent | Fresh board | Sandbox |
|---|---|---|---|
| Numbers SUM | sum of the leaves | PASS | PASS |
| Numbers MIN | smallest leaf | DEVIATES: SUM | DEVIATES: SUM |
| Numbers MAX | largest leaf | DEVIATES: SUM | DEVIATES: SUM |
| Numbers NONE | empty | DEVIATES: SUM | DEVIATES: SUM |
| Date MIN | earliest leaf | PASS | PASS |
| Date MAX | latest leaf | DEVIATES: MIN | DEVIATES: MIN |
| Date default (metadata MIN) | earliest leaf | PASS | n/a |
| Timeline MIN_MAX | earliest `from`, latest `to` (Q5) | PASS | PASS |

## Observed behaviour

[observed.md](observed.md) has, per board, API version and read: the column
metadata table, the leaf sanity table, and per parent × column the
configured function, leaf values, expected value, observed value, `is_leaf`,
which functions the observed value matches, `request_id` and send time.
Each table names its request file.

| Board | Read | 2026-04 | 2026-10 |
|---|---|---|---|
| Fresh | metadata | `captures/20-fresh-metadata-2026-04.json` | `captures/23-fresh-metadata-2026-10.json` |
| Fresh | ground truth (all items, values, `is_leaf`) | `captures/21-…` | `captures/24-…` |
| Fresh | parents P1, Q1 | `captures/22-…` (request_id `bfb67146-0851-9e07-9da0-382e5165449a`) | `captures/25-…` (request_id `42af85e7-d2dc-94ae-aeeb-d324ce506ecc`) |
| Fresh | parents re-read after 10 s | `captures/26-…` (`8f4693c6-9246-97d3-a78c-42ec08065898`) | `captures/27-…` (`e9c6d5cc-b2e2-9a3f-81b7-0079cc28b1ad`) |
| Sandbox | metadata | `captures/28-…` | `captures/31-…` |
| Sandbox | ground truth (R1 and R3 subtrees) | `captures/29-…` | `captures/32-…` |
| Sandbox | parents R1, A, A2, A2x, R3 | `captures/30-…` (`b83b69b4-fad9-9e0d-bdb4-a44aab373b46`) | `captures/33-…` (`a680c196-9e91-9007-8b8b-7333f4804efc`) |

Sandbox values (board "MLS Source", `18436846804`), both versions:

| Parent | Num SUM | Num MIN | Num MAX | Num NONE | Date MIN | Date MAX | Timeline |
|---|---|---|---|---|---|---|---|
| R1 expected | 136 | 11 | 100 | empty | 2026-01-10 | 2026-05-15 | 2026-01-05..2026-05-20 |
| R1 observed | 136 | **136** | **136** | **136** | 2026-01-10 | **2026-01-10** | 2026-01-05..2026-05-20 |
| A expected | 36 | 11 | 25 | empty | 2026-03-02 | 2026-05-15 | 2026-03-01..2026-05-20 |
| A observed | 36 | **36** | **36** | **36** | 2026-03-02 | **2026-03-02** | 2026-03-01..2026-05-20 |

A2 and A2x have one leaf (A2y = 25, 2026-05-15), so SUM, MIN and MAX agree;
their Num NONE still returns 25. R3's only leaf is empty and every R3 rollup
is empty. The sandbox reads were taken only after R1's and A's Num SUM
matched their leaves' sum, so no value stored on a parent's own cell (see
[`../parent-stored-value/`](../parent-stored-value/)) was counted
(observed.md, "Sandbox board").

Every request returned HTTP 200. Every read has no `errors`.
`extensions.request_id` equals the `x-request-id` header on every request.

The standalone run in `repro/sample-run/` produced the
same values on a separate board (`18436908247`, since deleted) at both
versions, first read and re-read.

## Board UI evidence

Sandbox R1, from a board screenshot taken on 2026-10-24. The same reading is
recorded in [`../parent-stored-value/fixture.json`](../parent-stored-value/fixture.json)
under `boardUi`; the screenshot itself is not in this repository. It was
taken while values had been written to R1's and A's own cells. The board
ignores those values ([`../parent-stored-value/`](../parent-stored-value/)),
so the UI values are the leaves' rollups.

| Item | Column | UI | API (this bundle) |
|---|---|---|---|
| R1 | Num SUM | 136 | 136 |
| R1 | Num MIN | 11 | 136 |
| R1 | Num MAX | 100 | 136 |
| R1 | Num NONE | empty | 136 |
| R1 | Date MIN | Jan 10 | 2026-01-10 |
| R1 | Date MAX | May 15 | 2026-01-10 |
| R1 | Timeline | Jan 5 – May 20 | 2026-01-05..2026-05-20 |
| A | Num MIN | 11 | 36 |
| A | Num MAX | 25 | 36 |
| A | Date MAX | May 15 | 2026-03-02 |

To check a fresh board in the UI: run `repro/setup-fixture.mjs`, open the
printed board, and compare each parent row with `run-repro.mjs` output. The
UI should show, per the configured function:

| Parent | Num SUM | Num MIN | Num MAX | Num NONE | Date MIN | Date MAX | Timeline |
|---|---|---|---|---|---|---|---|
| Q1 | 47 | 7 | 40 | empty | Mar 3 | Jun 30 | Mar 1 – Jul 15 |
| P1 | 247 | 7 | 200 | empty | Jan 20 | Jun 30 | Jan 10 – Jul 15 |

No UI screenshot of a fresh board is in this bundle.

## Documentation map

| URL | Title | `updatedAt` | Rollup content used |
|---|---|---|---|
| [docs/working-with-multi-level-boards](https://developer.monday.com/api-reference/docs/working-with-multi-level-boards) | Working with multi-level boards | 2026-09-06T08:33:47Z | Supported functions table; `NONE`; metadata `function`; converting static/calculated |
| [reference/columns-other-types](https://developer.monday.com/api-reference/reference/columns-other-types) | Other types | 2026-09-06T08:35:36Z | `CalculatedCapability.function`; `CalculatedFunction` enum |
| [reference/date](https://developer.monday.com/api-reference/reference/date) | Date | 2026-09-06T08:34:47Z | `MAX` default; `calcType` setting |
| [reference/timeline](https://developer.monday.com/api-reference/reference/timeline) | Timeline | 2026-09-06T08:35:22Z | `MIN_MAX` definition |
| [reference/columns](https://developer.monday.com/api-reference/reference/columns) | Columns | 2026-09-06T08:35:36Z | `capabilities` field |
| reference/numbers | — | — | HTTP 404 |

No page says the API value of a parent can differ from the configured
function's result.

## Bundle index

| File | What it is |
|---|---|
| `README.md` | This file. |
| `observed.md` | Per board, version and read: metadata, leaf sanity, parent × column expected vs observed, matches, request ids, timestamps. Generated from the captures. |
| `fixture.json` | Account; fresh board id, name, `hierarchy_type`, every item with name, depth and parent, columns created (requested function, id, request file), column metadata per version, leaf values written; sandbox board items and column metadata per version. Generated from the captures. |
| `docs-quotes.md` | Verbatim documentation extract with URLs, heading paths and page `updatedAt`. |
| `captures/01-account-2026-10.json` | Account slug check. |
| `captures/02-create-board-2026-10.json` | `create_board(use_mls_template: true, empty: true)`. |
| `captures/03-…` to `captures/11-create-column-…-2026-10.json` | `create_column` per column, with `capabilities: {calculated: {function}}` (none for Date default). `09` is the rejected Date NONE. |
| `captures/12-…` to `captures/16-create-…-2026-10.json` | `create_item` P1, `create_subitem` Q1, Q1a, Q1b, P1c, all without values. |
| `captures/17-…` to `captures/19-write-leaf-…-2026-10.json` | `change_multiple_column_values` on Q1a, Q1b, P1c. |
| `captures/20-…` to `captures/25-fresh-…` | Fresh board metadata, ground truth and parents, 2026-04 then 2026-10. |
| `captures/26-`, `captures/27-fresh-parents-reread-…` | Parents re-read 10 s later, 2026-04 and 2026-10. |
| `captures/28-…` to `captures/33-sandbox-…` | Sandbox metadata, ground truth and parents, 2026-04 then 2026-10. Read-only. |
| `repro/setup-fixture.mjs` | Standalone: creates a multi-level board, the rollup columns and the fixture tree on any account. |
| `repro/run-repro.mjs` | Standalone: reads metadata, ground truth and parents at each version, re-reads after 10 s, prints and saves expected vs observed. |
| `repro/teardown.mjs` | Standalone: deletes the board named in `fixture-ids.json`. |
| `repro/sample-run/fixture-ids.json` | Board, column and item ids the setup run created, with the Date NONE error. |
| `repro/sample-run/setup-log.txt` | Setup stderr: every request's status, request_id and send time. |
| `repro/sample-run/setup-output.txt` | Setup stdout (same JSON as `fixture-ids.json`). |
| `repro/sample-run/repro-output.txt` | Repro stdout, both API versions and the re-read. |
| `repro/sample-run/repro-results.json` | Every repro capture (8 requests) with request body, headers, response, and the comparison tables. |
| `repro/sample-run/teardown-output.txt` | Teardown stdout: the deleted board id. |

Each request file holds: `endpoint`, `requestHeaders` (API-Version and
Content-Type; the Authorization header was sent and is not recorded),
`requestBody` (the exact string sent), `query`, `variables`, `startedAt` and
`endedAt` (ISO UTC, ms), `status`, `xRequestId`, `rateLimitHeaders`,
`responseHeaders` (only `api-version`, `content-type`, `date`, `ratelimit`, `ratelimit-policy` and `x-request-id`; every other response header was removed before publication), `extensionsRequestId`,
`responseBodyRaw` and the parsed `responseBody`. No file contains the token.

## Reproduce

### Standalone, on any monday account

Prerequisites: Node 18 or newer, an API token for a user who can create
boards in the target workspace. No packages to install. Every request is a
plain `fetch` to `https://api.monday.com/v2`.

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
node setup-fixture.mjs   # board "R4 rollup function repro <timestamp>", 9 column attempts, 5 items, 3 leaf writes, 10 s wait
node run-repro.mjs       # 3 reads per API version, then a parents re-read per version after 10 s
node teardown.mjs        # deletes that board only
```

`setup-fixture.mjs` pauses 1 s after each request and logs each request's
status and request_id to stderr. The Date NONE `create_column` is expected
to fail; the script records the error in `fixture-ids.json` and continues.

Expected `run-repro.mjs` output at each version, first read and re-read:
`DEVIATES` for Num MIN, Num MAX, Num NONE (each matching SUM) and Date MAX
(matching MIN) on both P1 and Q1; `PASS` for Num SUM, Date MIN, Date
default and Timeline MIN_MAX; every leaf-sanity row `PASS`.
