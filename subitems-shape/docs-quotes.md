# monday documentation on `subitems` (fetched 2026-10-24; quotes verbatim)

Fetch tool returned no clock time, so UTC fetch times are not recorded; page `updatedAt` metadata is given where the page supplies it.

## 1. Working with multi-level boards
URL: https://developer.monday.com/api-reference/docs/working-with-multi-level-boards (updatedAt 2026-09-06T08:33:47Z). Title: "Working with multi-level boards".

- "Summary of changes" > bullet: "Multi-level boards support up to five layers of subitems and share a consistent column structure between parent items and subitems."
- "API changes" > "Multi-level boards" table, row "All subitems are returned by `subitems` object, regardless of depth" | Classic boards: "Same behaviour" | How to mitigate: "Use the `parent_item` field to calculate parent-child hierarchy."
- Same table, row "Have up to five levels of subitems" | How to mitigate: "Subitems can now have their own subitems. Boards have a deeper hierarchy than the previous two-level structure."
- "Example queries" > "Multi-level board queries" > "Get items, subitems, and parent item relationship", intro: "This query gets items and their subitems. The `parent_item` field lets you reconstruct the hierarchy — subitems whose `parent_item` references another subitem are nested deeper in the tree."
- Same section, info callout: "The `subitems` field returns **all** descendants of an item (flattened), not just direct children. Use the `parent_item` field on each subitem to determine its depth and reconstruct the tree."

Example query (verbatim):
```graphql
query {
  boards(ids: 1234567890) {
    items_page(limit: 1) {
      items {
        id
        name
        subitems {
          id
          name
          parent_item {
            id
            name
          }
        }
      }
    }
  }
}
```
Example response: a top-level item whose `subitems` lists 1000000002 (parent 1000000001), 1000000003 (parent 1000000002), 1000000004 (parent 1000000003). The example uses a top-level item only; it shows no subitem's own `subitems`.

Heading outline: Working with multi-level boards; Summary of changes; Background; Multi-level boards; Architectural differences from classic boards; Rollup columns; Supported column types and rollup functions; Estimated timeline; Backwards compatibility; API changes; Multi-level boards; Rollup columns; Example queries; Multi-level board queries; Check board type with hierarchy_type; Get items, subitems, and parent item relationship; Get all items and subitems with hierarchy_scope_config; Rollup column queries; Creating columns with rollup capabilities; Mutation behavior on rollup columns; Get help.

Not on the page: a subitem's own `subitems`; requests mixing top-level and subitem ids.

## 2a. Items reference
URL: https://developer.monday.com/api-reference/reference/items (updatedAt 2026-09-06T08:36:01Z). Title: "Items".
Headings: Items; Queries; Get items (Arguments, Fields); Mutations; Create item; Duplicate item; Change an item's position; Set item description content; Update assets on item; Move item to group; Move item to board; Archive item; Clear item updates; Delete item.
- Fields table, `subitems`: type "[`[Item]`]", description "The item's subitems."
- `parent_item`: "A subitem's parent item. Returns `null` if querying a parent item."
- Argument `ids`: "The IDs of the specific items, subitems, or parent items to return. Maximum of 100 IDs at one time using the `limit` argument."
- "Duplicate item": "Duplicates an item (or subitem) and its nested subitems."
No statement on descendants vs direct children.

## 2b. Subitems reference
URL: https://developer.monday.com/api-reference/reference/subitems (updatedAt 2026-09-06T08:31:48Z). Title: "Subitems".
Headings: Subitems; Queries; Get subitems (Fields); Mutations; Create subitem.
- "Get subitems" bullet: "Can only be nested within another query (e.g., `items`); can't be queried directly at the root"
- Field `subitems` (on a subitem): "The subitem's subitems." type "[`[Item]`]".
- `parent_item`: "A subitem's parent item. If used for a parent item, it will return `null`."
- "Create subitem" > Arguments, `parent_item_id`: "The parent item's unique identifier. Can reference an item or subitem for multi-level boards."
- Warning callout: "For multi-level boards: * Subitems can be nested up to 5 levels deep. * `parent_item_id` can reference an item or subitem."
No statement on descendants vs direct children, nor on mixed ids.

## 3. Release notes / changelog
- https://developer.monday.com/api-reference/docs/release-notes (updatedAt 2026-10-13T10:31:14Z): "2025-10" > "Non-breaking changes": "New API support for [multi-level boards](...)". "2025-04" > "Hotfixes": "**February 27th, 2025:** We've introduced changes to the `subitems` query to help increase performance and return consistent results." (no detail). The last ~22.6k characters were summarised by the fetch tool, not read verbatim.
- https://developer.monday.com/api-reference/changelog/new-api-support-for-multi-level-boards: "New API support for multi-level boards", dated "September 26th, 2025"; no body text on subitems.

## Map
| URL | Title | Headings mentioning subitems |
|---|---|---|
| docs/working-with-multi-level-boards | Working with multi-level boards | "Get items, subitems, and parent item relationship"; "Get all items and subitems with hierarchy_scope_config" |
| reference/items | Items | none (field description only) |
| reference/subitems | Subitems | none (field description only) |
| docs/release-notes | Release notes | "2025-04" > "Hotfixes" |
| changelog/new-api-support-for-multi-level-boards | New API support for multi-level boards | none |
