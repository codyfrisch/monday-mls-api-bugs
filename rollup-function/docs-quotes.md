# monday documentation on rollup columns (fetched 2026-10-24; verbatim unless marked paraphrase)

Fetch tool gives no clock time. Page updatedAt shown where supplied.

## A. Working with multi-level boards
https://developer.monday.com/api-reference/docs/working-with-multi-level-boards (updatedAt 2026-09-06T08:33:47Z)

### Background > Rollup columns
- "Rollup is a new capability that can be enabled on **number**, **date**, **timeline**, and **status** columns on multi-level boards."
- "Columns with rollup can summarize the data in their child items. An individual rollup cell will either contain static data or summarize (roll up) the data of items below it. If an item is a parent, the cell will contain the summary of its child items. If the item has no children, the cell will contain a static value."
- "The `NONE` function disables rollup calculation on the column, while still keeping the capability metadata."

### Background > Rollup columns > Supported column types and rollup functions (table verbatim)
| Column type | Supported functions | Default function |
|---|---|---|
| `numbers` | `SUM`, `MIN`, `MAX`, `NONE` | `SUM` |
| `date` | `MIN`, `MAX`, `NONE` | `MAX` |
| `timeline` | `MIN_MAX`, `NONE` | `MIN_MAX` |
| `status` | `COUNT_KEYS`, `NONE` | `COUNT_KEYS` |

### API changes > Multi-level boards table
- Row "Creating first subitem copies parent values": "Creating the first subitem under a parent copies the parent's values into the subitem (unless values are explicitly provided). Subsequent subitems trigger rollup recalculation but do not copy values."
- Row "Changing column values (rollup columns): Blocked when the item has ≥1 subitem (parent cell is calculated)", mitigation "Remove all subitems to edit the parent (unblocks) or update child items instead."

### API changes > Rollup columns table
- "By default, rollup column values will **not** be returned by the `column_values` field — the API returns an empty array for these columns." / "To return rollup values, you must pass the argument `capabilities: [CALCULATED]` on the `column_values` field. This will return **both** rollup (calculated) and static values." / "This applies to **all** items on a multi-level board, including leaf items with no subitems."
- "Unlike status, these columns return their normal types (`NumbersValue`, `DateValue`, `TimelineValue`) regardless of rollup. Use the `is_leaf` field to distinguish static values from calculated rollup values."
- is_leaf row: "On multi-level boards with rollup columns: * `true` — the item has no subitems; the value is static. * `false` — the item has subitems; the value is a calculated rollup from child items."
- capabilities row: "The `capabilities` field on the `Column` object contains rollup metadata. Use it to see the aggregation function used by the column (e.g., `SUM`, `MIN`, `COUNT_KEYS`, etc)."
- create/update row: "On multi-level boards, number, date, timeline, and status columns are created with the calculated capability enabled." and "To disable rollup on a multi-level board, pass `capabilities: {calculated: {function: NONE}}`."
- Mutations row: "Writing to a rollup cell on a parent item does **not** return an error. The API returns a success response, but the value is **not** changed — the calculated value remains. Update child items instead."

### Example queries > Rollup column queries
- Get values for rollup columns: example `items_page(limit: 10) { items { id name column_values(capabilities: [CALCULATED]) { id text value ... on NumbersValue { number is_leaf } ... on DateValue { date is_leaf } ... on TimelineValue { from to is_leaf } ... on BatteryValue { battery_value { key count } is_leaf } } } }`. Callout: "Without `capabilities: [CALCULATED]`, the `column_values` field returns an empty array for rollup-capable columns — **even for leaf items with static values**."
- Distinguish static vs. calculated values with is_leaf: response Campaign {"number": 125, "is_leaf": false}; Phase 1 {"number": 125, "is_leaf": false}; Task A {"number": 100, "is_leaf": true}; Task B {"number": 25, "is_leaf": true}. Text: "\"Campaign\" and \"Phase 1\" show `is_leaf: false` — their values (125) are the sum of their children."
- Get rollup column metadata: "The `function` field returns the active rollup function (e.g., `SUM`, `MIN`, `MAX`, `MIN_MAX`, `COUNT_KEYS`, `NONE`)."
- Timeline callout: "The `MIN_MAX` function calculates the earliest `from` date and latest `to` date across all child items."

### Creating columns with rollup capabilities
- "On multi-level boards, number, date, timeline, and status columns are created with rollup enabled by default. You can explicitly specify the function."
- Callout: "Passing an empty `capabilities: {}` does **not** disable rollup on multi-level boards — the column will still receive the default rollup function. You must explicitly pass `function: NONE` to disable it."

### Mutation behavior on rollup columns
- Writing to leaf items: "Mutations on leaf items (no subitems) work normally. The value is set directly."
- Writing to parent items (calculated cells): same silent-success wording as the Mutations row above.
- Converting between static and calculated: "1. The parent's static values are copied to the new subitem (unless explicitly provided). 2. The parent's rollup columns become calculated — they now reflect the sum/min/max/count of children. 3. Subsequent subitems trigger rollup recalculation but do not copy values." and "Removing all subitems from a parent converts the cell back to static, allowing direct edits."

## B. Subitems reference
https://developer.monday.com/api-reference/reference/subitems (updatedAt 2026-09-06T08:31:48Z), Create subitem callout: "When you create the first subitem under a parent: If no values are provided, the parent's values are copied to the subitem and then cleared from the parent."

## C. Columns reference
https://developer.monday.com/api-reference/reference/columns (updatedAt 2026-09-06T08:35:36Z)
- Fields, `capabilities`: "Calculates and retrieves the column's rollup value."
- Change column value: "For multi-level boards, rollup column changes are blocked if the item has at least one subitem."
- create_column/update_column capabilities argument: "To override this default on multi-level boards, pass an empty argument to create the column without capabilities." (contradicts the A callout on empty capabilities)

## D. Other types
https://developer.monday.com/api-reference/reference/columns-other-types (updatedAt 2026-09-06T08:35:36Z)
- CalculatedFunction enum: `COUNT_KEYS`, `MAX`, `MIN`, `MIN_MAX`, `NONE`, `SUM`. "The function to count the values. If not provided, the default column type function will apply."
- CalculatedCapability.function: "The function to calculate the parent values."

## E. Date reference
https://developer.monday.com/api-reference/reference/date (updatedAt 2026-09-06T08:34:47Z)
- "Date rollup columns keep the `DateValue` type. Use the `is_leaf` field to distinguish static values (`true`) from calculated rollup values (`false`)."
- is_leaf field: "Whether this item has no subitems. On multi-level boards with rollup capability, `false` indicates the value is a calculated rollup from child items rather than a static value."
- "On multi-level boards, date columns are created with `MAX` rollup by default."
- Date mutation: "mutations on parent items with calculated rollup values **do not return an error** — the API returns a success response, but the value is not changed. Update child items instead."
- settings `calcType`: "Calculation type for date aggregation. One of `earliestToLatest`, `earliest`, or `latest`." (relation to MIN/MAX undocumented)

## F. Timeline reference
https://developer.monday.com/api-reference/reference/timeline (updatedAt 2026-09-06T08:35:22Z)
- "Timeline rollup columns keep the `TimelineValue` type. ... The `MIN_MAX` function calculates the earliest `from` date and latest `to` date across all child items."
- "On multi-level boards, timeline columns are created with `MIN_MAX` rollup by default."

## Not retrieved
- https://developer.monday.com/api-reference/reference/numbers → HTTP 404.
- No support.monday.com rollup article is linked from these pages.

## Map
| URL | Title | updatedAt | Rollup content |
|---|---|---|---|
| docs/working-with-multi-level-boards | Working with multi-level boards | 2026-09-06T08:33:47Z | Background > Rollup columns; Supported column types and rollup functions; API changes > Rollup columns; Rollup column queries; Creating columns; Mutation behavior |
| reference/subitems | Subitems | 2026-09-06T08:31:48Z | first-subitem copy/clear |
| reference/columns | Columns | 2026-09-06T08:35:36Z | capabilities; blocked changes; empty-capabilities conflict |
| reference/columns-other-types | Other types | 2026-09-06T08:35:36Z | CalculatedFunction enum |
| reference/date | Date | 2026-09-06T08:34:47Z | MAX default; is_leaf; calcType; silent success |
| reference/timeline | Timeline | 2026-09-06T08:35:22Z | MIN_MAX default; is_leaf |
| reference/numbers | — | — | 404 |
