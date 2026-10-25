# Observed: `subitems` on a multi-level board

Generated at 2026-10-25T02:29:59.387Z from the requests in `captures/`. Expected sets come from the `parent_item` ground truth in `fixture.json`: per the documentation, `subitems` of an item is every descendant of that item, flattened.

## Expected behaviour per documentation

See [README.md](README.md#expected-behaviour-per-documentation) for the verbatim quotes.

## Summary

Counts are observed/expected for each requested item's `subitems`.

| Case | API version | Observed/expected | Verdict | request_id | Sent (UTC) |
|---|---|---|---|---|---|
| C1 | 2026-04 | R1 root: 6/6 | PASS | `e02ca9d8-b6d2-934f-8c6f-6969f4a676b3` | 2026-10-25T02:29:27.682Z |
| C1 | 2026-10 | R1 root: 6/6 | PASS | `5876737a-3566-981a-8055-4353b27d514c` | 2026-10-25T02:29:45.464Z |
| C2 | 2026-04 | R3 empty-child root: 1/1; R1 root: 6/6 | PASS | `91f6fbde-2873-9537-b4b1-591ab1ef873e` | 2026-10-25T02:29:29.369Z |
| C2 | 2026-10 | R3 empty-child root: 1/1; R1 root: 6/6 | PASS | `f20ed6cb-0462-9792-a04c-acd101beb6da` | 2026-10-25T02:29:47.197Z |
| C3 | 2026-04 | A (L2): 2/4 | DEVIATES | `aedda396-4daf-9b95-a399-51a189405f9e` | 2026-10-25T02:29:30.993Z |
| C3 | 2026-10 | A (L2): 2/4 | DEVIATES | `5b3b5dcc-2653-9f73-94aa-eb9d863edff1` | 2026-10-25T02:29:49.016Z |
| C4 | 2026-04 | A2 (L3): 1/2 | DEVIATES | `1c2755de-e7f2-9ef0-a13d-b2ec6df0f2fe` | 2026-10-25T02:29:32.749Z |
| C4 | 2026-10 | A2 (L3): 1/2 | DEVIATES | `931719b4-b530-9ecf-b994-8573e0ae7b47` | 2026-10-25T02:29:51.125Z |
| C5 | 2026-04 | A (L2): 2/4; R1 root: 2/6 | DEVIATES | `9e82d7b0-4017-9b8f-bb8f-ac54abf12fae` | 2026-10-25T02:29:34.563Z |
| C5 | 2026-10 | A (L2): 2/4; R1 root: 2/6 | DEVIATES | `45f9088b-3d11-922a-9289-215e795e4cb9` | 2026-10-25T02:29:52.923Z |
| C6 | 2026-04 | A (L2): 2/4; R1 root: 2/6 | DEVIATES | `ba08275e-a4c6-9867-bbae-893f83b98fef` | 2026-10-25T02:29:36.389Z |
| C6 | 2026-10 | A (L2): 2/4; R1 root: 2/6 | DEVIATES | `e73b7a58-15de-96f1-a091-c25c2fd14cad` | 2026-10-25T02:29:54.747Z |
| C7 | 2026-04 | Item 1: 3/3; R1 root: 6/6; R2 leaf root: 0/0; R3 empty-child root: 1/1; DC deep-chain source: 0/0 | PASS | `6ab177ee-3cd7-9f58-a12b-ccc55a401e21` | 2026-10-25T02:29:38.245Z |
| C7 | 2026-10 | Item 1: 3/3; R1 root: 6/6; R2 leaf root: 0/0; R3 empty-child root: 1/1; DC deep-chain source: 0/0 | PASS | `021f4ad9-cb71-9606-868a-32378508e14e` | 2026-10-25T02:29:56.522Z |
| C8 | 2026-04 | A (L2): 2/4 | DEVIATES | `fe10cdff-ba99-9efc-bb7e-a344c373b983` | 2026-10-25T02:29:40.049Z |
| C8 | 2026-10 | A (L2): 2/4 | DEVIATES | `fd58ba35-8330-9a49-a04d-ac5de1be8585` | 2026-10-25T02:29:58.450Z |

## C1: top-level item alone [R1]

```graphql
query ($ids: [ID!]) { items(ids: $ids) { id name subitems { id name parent_item { id } } } }
```

Variables: `{"ids":["13374290733"]}`

#### 2026-04: PASS

File `captures/04-c1-top-level-alone-2026-04.json`. request_id `e02ca9d8-b6d2-934f-8c6f-6969f4a676b3`, x-request-id `e02ca9d8-b6d2-934f-8c6f-6969f4a676b3`, sent 2026-10-25T02:29:27.682Z, HTTP 200.

| Item (path) | Expected per docs | Observed | Missing | Unexpected | Verdict |
|---|---|---|---|---|---|
| R1 root `13374290733` | 6: B (L2 leaf) `13374223931`<br>A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669`<br>A (L2) `13374271723` | 6: B (L2 leaf) `13374223931`<br>A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669`<br>A (L2) `13374271723` | none | none | PASS |

#### 2026-10: PASS

File `captures/14-c1-top-level-alone-2026-10.json`. request_id `5876737a-3566-981a-8055-4353b27d514c`, x-request-id `5876737a-3566-981a-8055-4353b27d514c`, sent 2026-10-25T02:29:45.464Z, HTTP 200.

| Item (path) | Expected per docs | Observed | Missing | Unexpected | Verdict |
|---|---|---|---|---|---|
| R1 root `13374290733` | 6: B (L2 leaf) `13374223931`<br>A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669`<br>A (L2) `13374271723` | 6: B (L2 leaf) `13374223931`<br>A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669`<br>A (L2) `13374271723` | none | none | PASS |

## C2: two top-level items [R1, R3]

```graphql
query ($ids: [ID!]) { items(ids: $ids) { id name subitems { id name parent_item { id } } } }
```

Variables: `{"ids":["13374290733","13374267172"]}`

#### 2026-04: PASS

File `captures/05-c2-top-level-pair-2026-04.json`. request_id `91f6fbde-2873-9537-b4b1-591ab1ef873e`, x-request-id `91f6fbde-2873-9537-b4b1-591ab1ef873e`, sent 2026-10-25T02:29:29.369Z, HTTP 200.

| Item (path) | Expected per docs | Observed | Missing | Unexpected | Verdict |
|---|---|---|---|---|---|
| R3 empty-child root `13374267172` | 1: R3c (empty leaf) `13374224094` | 1: R3c (empty leaf) `13374224094` | none | none | PASS |
| R1 root `13374290733` | 6: B (L2 leaf) `13374223931`<br>A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669`<br>A (L2) `13374271723` | 6: B (L2 leaf) `13374223931`<br>A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669`<br>A (L2) `13374271723` | none | none | PASS |

#### 2026-10: PASS

File `captures/15-c2-top-level-pair-2026-10.json`. request_id `f20ed6cb-0462-9792-a04c-acd101beb6da`, x-request-id `f20ed6cb-0462-9792-a04c-acd101beb6da`, sent 2026-10-25T02:29:47.197Z, HTTP 200.

| Item (path) | Expected per docs | Observed | Missing | Unexpected | Verdict |
|---|---|---|---|---|---|
| R3 empty-child root `13374267172` | 1: R3c (empty leaf) `13374224094` | 1: R3c (empty leaf) `13374224094` | none | none | PASS |
| R1 root `13374290733` | 6: B (L2 leaf) `13374223931`<br>A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669`<br>A (L2) `13374271723` | 6: B (L2 leaf) `13374223931`<br>A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669`<br>A (L2) `13374271723` | none | none | PASS |

## C3: mid-level subitem alone [A]

```graphql
query ($ids: [ID!]) { items(ids: $ids) { id name subitems { id name parent_item { id } } } }
```

Variables: `{"ids":["13374271723"]}`

#### 2026-04: DEVIATES

File `captures/06-c3-mid-level-alone-2026-04.json`. request_id `aedda396-4daf-9b95-a399-51a189405f9e`, x-request-id `aedda396-4daf-9b95-a399-51a189405f9e`, sent 2026-10-25T02:29:30.993Z, HTTP 200.

| Item (path) | Expected per docs | Observed | Missing | Unexpected | Verdict |
|---|---|---|---|---|---|
| A (L2) `13374271723` | 4: A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669` | 2: A2 (L3) `13374259848`<br>A1 (L3 leaf) `13374266669` | A2x (L4) `13374242116`<br>A2y (L5 leaf) `13374259917` | none | DEVIATES |

#### 2026-10: DEVIATES

File `captures/16-c3-mid-level-alone-2026-10.json`. request_id `5b3b5dcc-2653-9f73-94aa-eb9d863edff1`, x-request-id `5b3b5dcc-2653-9f73-94aa-eb9d863edff1`, sent 2026-10-25T02:29:49.016Z, HTTP 200.

| Item (path) | Expected per docs | Observed | Missing | Unexpected | Verdict |
|---|---|---|---|---|---|
| A (L2) `13374271723` | 4: A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669` | 2: A2 (L3) `13374259848`<br>A1 (L3 leaf) `13374266669` | A2x (L4) `13374242116`<br>A2y (L5 leaf) `13374259917` | none | DEVIATES |

## C4: subitem A2 alone [A2]

```graphql
query ($ids: [ID!]) { items(ids: $ids) { id name subitems { id name parent_item { id } } } }
```

Variables: `{"ids":["13374259848"]}`

#### 2026-04: DEVIATES

File `captures/07-c4-a2-alone-2026-04.json`. request_id `1c2755de-e7f2-9ef0-a13d-b2ec6df0f2fe`, x-request-id `1c2755de-e7f2-9ef0-a13d-b2ec6df0f2fe`, sent 2026-10-25T02:29:32.749Z, HTTP 200.

| Item (path) | Expected per docs | Observed | Missing | Unexpected | Verdict |
|---|---|---|---|---|---|
| A2 (L3) `13374259848` | 2: A2x (L4) `13374242116`<br>A2y (L5 leaf) `13374259917` | 1: A2x (L4) `13374242116` | A2y (L5 leaf) `13374259917` | none | DEVIATES |

#### 2026-10: DEVIATES

File `captures/17-c4-a2-alone-2026-10.json`. request_id `931719b4-b530-9ecf-b994-8573e0ae7b47`, x-request-id `931719b4-b530-9ecf-b994-8573e0ae7b47`, sent 2026-10-25T02:29:51.125Z, HTTP 200.

| Item (path) | Expected per docs | Observed | Missing | Unexpected | Verdict |
|---|---|---|---|---|---|
| A2 (L3) `13374259848` | 2: A2x (L4) `13374242116`<br>A2y (L5 leaf) `13374259917` | 1: A2x (L4) `13374242116` | A2y (L5 leaf) `13374259917` | none | DEVIATES |

## C5: mixed batch [R1, A]

```graphql
query ($ids: [ID!]) { items(ids: $ids) { id name subitems { id name parent_item { id } } } }
```

Variables: `{"ids":["13374290733","13374271723"]}`

#### 2026-04: DEVIATES

File `captures/08-c5-mixed-2026-04.json`. request_id `9e82d7b0-4017-9b8f-bb8f-ac54abf12fae`, x-request-id `9e82d7b0-4017-9b8f-bb8f-ac54abf12fae`, sent 2026-10-25T02:29:34.563Z, HTTP 200.

| Item (path) | Expected per docs | Observed | Missing | Unexpected | Verdict |
|---|---|---|---|---|---|
| A (L2) `13374271723` | 4: A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669` | 2: A2 (L3) `13374259848`<br>A1 (L3 leaf) `13374266669` | A2x (L4) `13374242116`<br>A2y (L5 leaf) `13374259917` | none | DEVIATES |
| R1 root `13374290733` | 6: B (L2 leaf) `13374223931`<br>A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669`<br>A (L2) `13374271723` | 2: B (L2 leaf) `13374223931`<br>A (L2) `13374271723` | A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669` | none | DEVIATES |

#### 2026-10: DEVIATES

File `captures/18-c5-mixed-2026-10.json`. request_id `45f9088b-3d11-922a-9289-215e795e4cb9`, x-request-id `45f9088b-3d11-922a-9289-215e795e4cb9`, sent 2026-10-25T02:29:52.923Z, HTTP 200.

| Item (path) | Expected per docs | Observed | Missing | Unexpected | Verdict |
|---|---|---|---|---|---|
| A (L2) `13374271723` | 4: A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669` | 2: A2 (L3) `13374259848`<br>A1 (L3 leaf) `13374266669` | A2x (L4) `13374242116`<br>A2y (L5 leaf) `13374259917` | none | DEVIATES |
| R1 root `13374290733` | 6: B (L2 leaf) `13374223931`<br>A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669`<br>A (L2) `13374271723` | 2: B (L2 leaf) `13374223931`<br>A (L2) `13374271723` | A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669` | none | DEVIATES |

## C6: mixed batch, reversed [A, R1]

```graphql
query ($ids: [ID!]) { items(ids: $ids) { id name subitems { id name parent_item { id } } } }
```

Variables: `{"ids":["13374271723","13374290733"]}`

#### 2026-04: DEVIATES

File `captures/09-c6-mixed-reversed-2026-04.json`. request_id `ba08275e-a4c6-9867-bbae-893f83b98fef`, x-request-id `ba08275e-a4c6-9867-bbae-893f83b98fef`, sent 2026-10-25T02:29:36.389Z, HTTP 200.

| Item (path) | Expected per docs | Observed | Missing | Unexpected | Verdict |
|---|---|---|---|---|---|
| A (L2) `13374271723` | 4: A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669` | 2: A2 (L3) `13374259848`<br>A1 (L3 leaf) `13374266669` | A2x (L4) `13374242116`<br>A2y (L5 leaf) `13374259917` | none | DEVIATES |
| R1 root `13374290733` | 6: B (L2 leaf) `13374223931`<br>A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669`<br>A (L2) `13374271723` | 2: B (L2 leaf) `13374223931`<br>A (L2) `13374271723` | A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669` | none | DEVIATES |

#### 2026-10: DEVIATES

File `captures/19-c6-mixed-reversed-2026-10.json`. request_id `e73b7a58-15de-96f1-a091-c25c2fd14cad`, x-request-id `e73b7a58-15de-96f1-a091-c25c2fd14cad`, sent 2026-10-25T02:29:54.747Z, HTTP 200.

| Item (path) | Expected per docs | Observed | Missing | Unexpected | Verdict |
|---|---|---|---|---|---|
| A (L2) `13374271723` | 4: A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669` | 2: A2 (L3) `13374259848`<br>A1 (L3 leaf) `13374266669` | A2x (L4) `13374242116`<br>A2y (L5 leaf) `13374259917` | none | DEVIATES |
| R1 root `13374290733` | 6: B (L2 leaf) `13374223931`<br>A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669`<br>A (L2) `13374271723` | 2: B (L2 leaf) `13374223931`<br>A (L2) `13374271723` | A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669` | none | DEVIATES |

## C7: items_page on the board

```graphql
query ($b: [ID!]) { boards(ids: $b) { items_page(limit: 50) { items { id name subitems { id name parent_item { id } } } } } }
```

Variables: `{"b":["18436846804"]}`

#### 2026-04: PASS

File `captures/10-c7-items-page-2026-04.json`. request_id `6ab177ee-3cd7-9f58-a12b-ccc55a401e21`, x-request-id `6ab177ee-3cd7-9f58-a12b-ccc55a401e21`, sent 2026-10-25T02:29:38.245Z, HTTP 200.

| Item (path) | Expected per docs | Observed | Missing | Unexpected | Verdict |
|---|---|---|---|---|---|
| Item 1 `13374291641` | 3: Subitem Level 1 `13374291640`<br>Subitem Level 2 `13374291642`<br>Subitem Level 2 `13374291643` | 3: Subitem Level 1 `13374291640`<br>Subitem Level 2 `13374291642`<br>Subitem Level 2 `13374291643` | none | none | PASS |
| R1 root `13374290733` | 6: B (L2 leaf) `13374223931`<br>A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669`<br>A (L2) `13374271723` | 6: B (L2 leaf) `13374223931`<br>A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669`<br>A (L2) `13374271723` | none | none | PASS |
| R2 leaf root `13374276846` | 0: none | 0: none | none | none | PASS |
| R3 empty-child root `13374267172` | 1: R3c (empty leaf) `13374224094` | 1: R3c (empty leaf) `13374224094` | none | none | PASS |
| DC deep-chain source `13377169129` | 0: none | 0: none | none | none | PASS |

#### 2026-10: PASS

File `captures/20-c7-items-page-2026-10.json`. request_id `021f4ad9-cb71-9606-868a-32378508e14e`, x-request-id `021f4ad9-cb71-9606-868a-32378508e14e`, sent 2026-10-25T02:29:56.522Z, HTTP 200.

| Item (path) | Expected per docs | Observed | Missing | Unexpected | Verdict |
|---|---|---|---|---|---|
| Item 1 `13374291641` | 3: Subitem Level 1 `13374291640`<br>Subitem Level 2 `13374291642`<br>Subitem Level 2 `13374291643` | 3: Subitem Level 1 `13374291640`<br>Subitem Level 2 `13374291642`<br>Subitem Level 2 `13374291643` | none | none | PASS |
| R1 root `13374290733` | 6: B (L2 leaf) `13374223931`<br>A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669`<br>A (L2) `13374271723` | 6: B (L2 leaf) `13374223931`<br>A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669`<br>A (L2) `13374271723` | none | none | PASS |
| R2 leaf root `13374276846` | 0: none | 0: none | none | none | PASS |
| R3 empty-child root `13374267172` | 1: R3c (empty leaf) `13374224094` | 1: R3c (empty leaf) `13374224094` | none | none | PASS |
| DC deep-chain source `13377169129` | 0: none | 0: none | none | none | PASS |

## C8: nested subitems selection on [A]

```graphql
query ($ids: [ID!]) { items(ids: $ids) { id name subitems { id name parent_item { id } subitems { id name parent_item { id } subitems { id name } } } } }
```

Variables: `{"ids":["13374271723"]}`

#### 2026-04: DEVIATES

File `captures/11-c8-nested-a-2026-04.json`. request_id `fe10cdff-ba99-9efc-bb7e-a344c373b983`, x-request-id `fe10cdff-ba99-9efc-bb7e-a344c373b983`, sent 2026-10-25T02:29:40.049Z, HTTP 200.

| Item (path) | Expected per docs | Observed | Missing | Unexpected | Verdict |
|---|---|---|---|---|---|
| A (L2) `13374271723` | 4: A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669` | 2: A2 (L3) `13374259848`<br>A1 (L3 leaf) `13374266669` | A2x (L4) `13374242116`<br>A2y (L5 leaf) `13374259917` | none | DEVIATES |
| A (L2) > A1 (L3 leaf) `13374266669` | 0: none | 0: none | none | none | PASS |
| A (L2) > A2 (L3) `13374259848` | 2: A2x (L4) `13374242116`<br>A2y (L5 leaf) `13374259917` | 1: A2x (L4) `13374242116` | A2y (L5 leaf) `13374259917` | none | DEVIATES |
| A (L2) > A2 (L3) > A2x (L4) `13374242116` | 1: A2y (L5 leaf) `13374259917` | 1: A2y (L5 leaf) `13374259917` | none | none | PASS |

#### 2026-10: DEVIATES

File `captures/21-c8-nested-a-2026-10.json`. request_id `fd58ba35-8330-9a49-a04d-ac5de1be8585`, x-request-id `fd58ba35-8330-9a49-a04d-ac5de1be8585`, sent 2026-10-25T02:29:58.450Z, HTTP 200.

| Item (path) | Expected per docs | Observed | Missing | Unexpected | Verdict |
|---|---|---|---|---|---|
| A (L2) `13374271723` | 4: A2x (L4) `13374242116`<br>A2 (L3) `13374259848`<br>A2y (L5 leaf) `13374259917`<br>A1 (L3 leaf) `13374266669` | 2: A2 (L3) `13374259848`<br>A1 (L3 leaf) `13374266669` | A2x (L4) `13374242116`<br>A2y (L5 leaf) `13374259917` | none | DEVIATES |
| A (L2) > A1 (L3 leaf) `13374266669` | 0: none | 0: none | none | none | PASS |
| A (L2) > A2 (L3) `13374259848` | 2: A2x (L4) `13374242116`<br>A2y (L5 leaf) `13374259917` | 1: A2x (L4) `13374242116` | A2y (L5 leaf) `13374259917` | none | DEVIATES |
| A (L2) > A2 (L3) > A2x (L4) `13374242116` | 1: A2y (L5 leaf) `13374259917` | 1: A2y (L5 leaf) `13374259917` | none | none | PASS |
