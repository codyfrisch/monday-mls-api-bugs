# monday-mls-api-bugs

Evidence and reproduction scripts for three monday.com API issues on
multi-level boards (`hierarchy_type: multi_level`), submitted to monday
support. Each folder holds one issue: the documented behaviour with verbatim
quotes, the observed behaviour, every captured request and response with its
monday request id, and a standalone script set that rebuilds the fixture on
any account and reproduces the result.

## Issues

| Folder | Summary | API versions reproduced |
|---|---|---|
| [`subitems-shape/`](subitems-shape/) | `subitems` returns direct children instead of all descendants for any subitem id, and one subitem id in an `items(ids:)` request switches every item in the response, top-level items included, to direct children. | 2026-04, 2026-10 |
| [`parent-stored-value/`](parent-stored-value/) | A write to a parent's rollup cell succeeds, and from then on the API's rollup for that parent and every ancestor includes the written value. The board UI ignores it. | 2026-04, 2026-10 |
| [`rollup-function/`](rollup-function/) | The API computes every parent's Numbers rollup as SUM and every Date rollup as MIN, whatever function the column is configured with. Column metadata and the board UI use the configured function. | 2026-04, 2026-10 |

Each folder contains:

| Path | Contents |
|---|---|
| `README.md` | Documentation quotes, expected vs observed tables, request ids, and the file index. |
| `observed.md` | Per-case expected and observed values with `request_id` and send time. |
| `fixture.json` | Board, item and column ids and values of the board the captures ran against. |
| `docs-quotes.md` | Verbatim documentation extract with URLs and page `updatedAt`. |
| `captures/` | One JSON file per request: request body, API version, timestamps, HTTP status, request ids, rate-limit headers and the response. |
| `repro/` | `setup-fixture.mjs`, `run-repro.mjs`, `teardown.mjs`. |
| `repro/sample-run/` | Output of one full repro run on 2026-10-25. |

## Running a repro

Requirements: Node 18 or newer and a monday API token for a user who can
create boards in the target workspace. The scripts have no dependencies;
every request is a plain `fetch` to `https://api.monday.com/v2`.

| Variable | Required | Meaning |
|---|---|---|
| `MONDAY_API_TOKEN` | yes | API token. Sent only in the `Authorization` header; never printed or written to disk. |
| `MONDAY_WORKSPACE_ID` | setup only | Workspace the throwaway board is created in. |
| `MONDAY_API_VERSION` | no | API version for setup. Default `2026-10`; `2026-04` rejects `create_board(use_mls_template:)`. |
| `MONDAY_API_VERSIONS` | no | Comma-separated versions for `run-repro.mjs`. Default `2026-04,2026-10`. |

Each folder's README lists the remaining optional variables.

```sh
cd subitems-shape/repro        # or parent-stored-value/repro, rollup-function/repro
export MONDAY_API_TOKEN=...
export MONDAY_WORKSPACE_ID=...
node setup-fixture.mjs         # creates the board and items; writes fixture-ids.json
node run-repro.mjs             # prints expected vs observed; writes repro-results.json
node teardown.mjs              # deletes the board named in fixture-ids.json
```

`setup-fixture.mjs` creates a new board in the workspace given, and
`teardown.mjs` deletes that board and nothing else. `run-repro.mjs` in
`parent-stored-value/` writes to two parent items on that board and clears
them before it exits, unless `REPRO_LEAVE_VALUES=1` is set for a UI check. No script touches any other board.

## Data in this repository

The captures come from a monday test account. Before publication:

- The account slug and account name are replaced with `sandbox-account`.
- The workspace id is replaced with `<redacted>`.
- Response headers are reduced to `api-version`, `content-type`, `date`,
  `ratelimit`, `ratelimit-policy` and `x-request-id`. Cookies, `cf-ray`,
  routing, CSP and other infrastructure headers are removed.
- Local filesystem paths and references to the reporter's internal tooling
  are removed.

Kept as captured: monday request ids (`extensions.request_id` and
`x-request-id`), timestamps, API versions, query bodies and variables, board,
item and column ids, item names, column titles, values, HTTP status and
rate-limit headers. Monday support can look up any request by its request id.
The API token was never recorded. The captures contain no user ids, emails or
avatar URLs; none of the queries select user fields.

## License

[MIT](LICENSE)
