# Observed: a parent's own stored value in its rollup

Generated at 2026-10-25T02:41:53.074Z from the requests in `captures/`. Expected values are the column's function over the parent's leaves, from the ground-truth read in `fixture.json`. Per the documentation a write to a parent's rollup cell is refused or changes nothing, so the API value after the write should equal the value before it.

See [README.md](README.md#expected-behaviour-per-documentation) for the verbatim quotes.

## Summary

| API version | Parent | Column | Expected per docs | API before | API after | After = model with own values | Verdict |
|---|---|---|---|---|---|---|---|
| 2026-04 | R1 | Num SUM | 136 | 136 | 1141 | yes | DEVIATES: own values counted |
| 2026-04 | R1 | Num MIN | 11 | 136 | 139 | yes | DEVIATES: own values counted |
| 2026-04 | R1 | Num MAX | 100 | 136 | 1635 | yes | DEVIATES: own values counted |
| 2026-04 | R1 | Num NONE | empty | 136 | 1141 | yes | DEVIATES: own values counted |
| 2026-04 | R1 | Date MIN | 2026-01-10 | 2026-01-10 | 2019-01-01 | yes | DEVIATES: own values counted |
| 2026-04 | R1 | Date MAX | 2026-05-15 | 2026-01-10 | 2026-01-10 | yes | unchanged: own values cannot move the API's function here |
| 2026-04 | R1 | Timeline | 2026-01-05 - 2026-05-20 | 2026-01-05 - 2026-05-20 | 2019-01-01 - 2031-01-01 | yes | DEVIATES: own values counted |
| 2026-04 | A | Num SUM | 36 | 36 | 1036 | yes | DEVIATES: own values counted |
| 2026-04 | A | Num MIN | 11 | 36 | 37 | yes | DEVIATES: own values counted |
| 2026-04 | A | Num MAX | 25 | 36 | 1035 | yes | DEVIATES: own values counted |
| 2026-04 | A | Num NONE | empty | 36 | 1036 | yes | DEVIATES: own values counted |
| 2026-04 | A | Date MIN | 2026-03-02 | 2026-03-02 | 2019-01-01 | yes | DEVIATES: own values counted |
| 2026-04 | A | Date MAX | 2026-05-15 | 2026-03-02 | 2026-03-02 | yes | unchanged: own values cannot move the API's function here |
| 2026-04 | A | Timeline | 2026-03-01 - 2026-05-20 | 2026-03-01 - 2026-05-20 | 2019-01-01 - 2031-01-01 | yes | DEVIATES: own values counted |
| 2026-10 | R1 | Num SUM | 136 | 136 | 1141 | yes | DEVIATES: own values counted |
| 2026-10 | R1 | Num MIN | 11 | 136 | 139 | yes | DEVIATES: own values counted |
| 2026-10 | R1 | Num MAX | 100 | 136 | 1635 | yes | DEVIATES: own values counted |
| 2026-10 | R1 | Num NONE | empty | 136 | 1141 | yes | DEVIATES: own values counted |
| 2026-10 | R1 | Date MIN | 2026-01-10 | 2026-01-10 | 2019-01-01 | yes | DEVIATES: own values counted |
| 2026-10 | R1 | Date MAX | 2026-05-15 | 2026-01-10 | 2026-01-10 | yes | unchanged: own values cannot move the API's function here |
| 2026-10 | R1 | Timeline | 2026-01-05 - 2026-05-20 | 2026-01-05 - 2026-05-20 | 2019-01-01 - 2031-01-01 | yes | DEVIATES: own values counted |
| 2026-10 | A | Num SUM | 36 | 36 | 1036 | yes | DEVIATES: own values counted |
| 2026-10 | A | Num MIN | 11 | 36 | 37 | yes | DEVIATES: own values counted |
| 2026-10 | A | Num MAX | 25 | 36 | 1035 | yes | DEVIATES: own values counted |
| 2026-10 | A | Num NONE | empty | 36 | 1036 | yes | DEVIATES: own values counted |
| 2026-10 | A | Date MIN | 2026-03-02 | 2026-03-02 | 2019-01-01 | yes | DEVIATES: own values counted |
| 2026-10 | A | Date MAX | 2026-05-15 | 2026-03-02 | 2026-03-02 | yes | unchanged: own values cannot move the API's function here |
| 2026-10 | A | Timeline | 2026-03-01 - 2026-05-20 | 2026-03-01 - 2026-05-20 | 2019-01-01 - 2031-01-01 | yes | DEVIATES: own values counted |

## API-Version 2026-04

Ground truth: `captures/02-ground-truth-2026-04.json` (request_id `0a56c6ff-795d-9d4a-b710-3e37f75635ae`, HTTP 200, sent 2026-10-25T02:41:17.897Z). Column metadata: `captures/03-column-metadata-2026-04.json` (request_id `c9241907-c348-92b8-bb07-c8fcacaaa4b9`, HTTP 200, sent 2026-10-25T02:41:20.315Z).

### Column metadata

The board returned **no columns** for these ids (`columns: []`).

### Writes and clears

| Mutation | Request | Response |
|---|---|---|
| Write R1's own rollup cells | `captures/05-write-r1-2026-04.json` (request_id `8252c5ad-7290-934b-bf9e-66bcf8db6a59`, HTTP 200, sent 2026-10-25T02:41:23.602Z) | data: `{"change_multiple_column_values":{"id":"13374290733"}}` |
| Write A's own rollup cells | `captures/06-write-a-2026-04.json` (request_id `9301c9c4-4f81-9799-bcb6-c418e7e95b9b`, HTTP 200, sent 2026-10-25T02:41:26.316Z) | data: `{"change_multiple_column_values":{"id":"13374271723"}}` |
| Clear R1's own rollup cells (null) | `captures/08-clear-r1-2026-04.json` (request_id `2d700e70-1880-9ba2-b3af-16132e26ef58`, HTTP 200, sent 2026-10-25T02:41:30.259Z) | data: `{"change_multiple_column_values":{"id":"13374290733"}}` |
| Clear A's own rollup cells (null) | `captures/09-clear-a-2026-04.json` (request_id `d2b84514-c353-9a56-ace3-32fb619e4c30`, HTTP 200, sent 2026-10-25T02:41:32.385Z) | data: `{"change_multiple_column_values":{"id":"13374271723"}}` |

### Reads

- Before: `captures/04-before-2026-04.json` (request_id `f4e69575-4bc3-9d56-9cda-e40580814b67`, HTTP 200, sent 2026-10-25T02:41:21.715Z)
- After, read 1: `captures/07-after-2026-04.json` (request_id `2a6d587c-9970-9309-9d41-5f95953c9867`, HTTP 200, sent 2026-10-25T02:41:28.351Z)
- Restore, read 1: `captures/10-restore-2026-04.json` (request_id `ddf90549-3e4c-91a2-b314-780d43d6e158`, HTTP 200, sent 2026-10-25T02:41:34.473Z)

### Parent values

Leaves: the leaf values under the parent (ground truth). Expected: the column's function over the leaves, per the documentation. Own values: what was written to R1's and A's own cells in this parent's subtree, the parent's own first. Model: the function the API applies to this column type (numbers SUM, date MIN, timeline MIN_MAX; see `../rollup-function/`) over the leaves and the own values. Board UI: the reading from a board screenshot taken on 2026-10-24 after the same write on the same board (`fixture.json`, `boardUi`).

| Parent | Column | Leaves | Expected per docs | Board UI | API before | Own values | API after | Model with own values | API after clear | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| R1 | Num SUM | 100, 11, 25 | 136 | 136 | 136 | 5, 1000 | 1141 | 1141 | 136 | DEVIATES: own values counted |
| R1 | Num MIN | 100, 11, 25 | 11 | 11 | 136 | 2, 1 | 139 | 139 | 136 | DEVIATES: own values counted |
| R1 | Num MAX | 100, 11, 25 | 100 | 100 | 136 | 500, 999 | 1635 | 1635 | 136 | DEVIATES: own values counted |
| R1 | Num NONE | 100, 11, 25 | empty | empty | 136 | 5, 1000 | 1141 | 1141 | 136 | DEVIATES: own values counted |
| R1 | Date MIN | 2026-01-10, 2026-03-02, 2026-05-15 | 2026-01-10 | Jan 10 | 2026-01-10 | 2020-01-01, 2019-01-01 | 2019-01-01 | 2019-01-01 | 2026-01-10 | DEVIATES: own values counted |
| R1 | Date MAX | 2026-01-10, 2026-03-02, 2026-05-15 | 2026-05-15 | May 15 | 2026-01-10 | 2030-01-01, 2031-01-01 | 2026-01-10 | 2026-01-10 | 2026-01-10 | unchanged: own values cannot move the API's function here |
| R1 | Timeline | 2026-01-05 - 2026-01-12, 2026-03-01 - 2026-03-10, 2026-05-01 - 2026-05-20 | 2026-01-05 - 2026-05-20 | Jan 5 - May 20 | 2026-01-05 - 2026-05-20 | 2020-01-01 - 2030-01-01, 2019-01-01 - 2031-01-01 | 2019-01-01 - 2031-01-01 | 2019-01-01 - 2031-01-01 | 2026-01-05 - 2026-05-20 | DEVIATES: own values counted |
| A | Num SUM | 11, 25 | 36 | 36 | 36 | 1000 | 1036 | 1036 | 36 | DEVIATES: own values counted |
| A | Num MIN | 11, 25 | 11 | 11 | 36 | 1 | 37 | 37 | 36 | DEVIATES: own values counted |
| A | Num MAX | 11, 25 | 25 | 25 | 36 | 999 | 1035 | 1035 | 36 | DEVIATES: own values counted |
| A | Num NONE | 11, 25 | empty | empty | 36 | 1000 | 1036 | 1036 | 36 | DEVIATES: own values counted |
| A | Date MIN | 2026-03-02, 2026-05-15 | 2026-03-02 | Mar 2 | 2026-03-02 | 2019-01-01 | 2019-01-01 | 2019-01-01 | 2026-03-02 | DEVIATES: own values counted |
| A | Date MAX | 2026-03-02, 2026-05-15 | 2026-05-15 | May 15 | 2026-03-02 | 2031-01-01 | 2026-03-02 | 2026-03-02 | 2026-03-02 | unchanged: own values cannot move the API's function here |
| A | Timeline | 2026-03-01 - 2026-03-10, 2026-05-01 - 2026-05-20 | 2026-03-01 - 2026-05-20 | Mar 1 - May 20 | 2026-03-01 - 2026-05-20 | 2019-01-01 - 2031-01-01 | 2019-01-01 - 2031-01-01 | 2019-01-01 - 2031-01-01 | 2026-03-01 - 2026-05-20 | DEVIATES: own values counted |

## API-Version 2026-10

Ground truth: `captures/11-ground-truth-2026-10.json` (request_id `11ca417b-8344-9296-b854-1bf65cfe890a`, HTTP 200, sent 2026-10-25T02:41:36.362Z). Column metadata: `captures/12-column-metadata-2026-10.json` (request_id `a1698de5-f38f-9e78-a202-8c2ba08c782f`, HTTP 200, sent 2026-10-25T02:41:38.712Z).

### Column metadata

| Column id | Title | Type | `capabilities.calculated.function` |
|---|---|---|---|
| `timerange_mkyvnykb` | Timeline | timeline | MIN_MAX |
| `numeric_mm8er9xg` | Num SUM | numbers | SUM |
| `numeric_mm8esxg1` | Num MIN | numbers | MIN |
| `numeric_mm8e1qed` | Num MAX | numbers | MAX |
| `numeric_mm8e1myd` | Num NONE | numbers | NONE |
| `date_mm8es1zd` | Date MAX | date | MAX |
| `date_mm8e937y` | Date MIN | date | MIN |

### Writes and clears

| Mutation | Request | Response |
|---|---|---|
| Write R1's own rollup cells | `captures/14-write-r1-2026-10.json` (request_id `446f62bb-e161-9c0b-9d6b-0d168896899a`, HTTP 200, sent 2026-10-25T02:41:41.946Z) | data: `{"change_multiple_column_values":{"id":"13374290733"}}` |
| Write A's own rollup cells | `captures/15-write-a-2026-10.json` (request_id `7effcbe4-7c30-936c-8da3-6105861abed4`, HTTP 200, sent 2026-10-25T02:41:44.104Z) | data: `{"change_multiple_column_values":{"id":"13374271723"}}` |
| Clear R1's own rollup cells (null) | `captures/17-clear-r1-2026-10.json` (request_id `195de513-1d74-9301-b30d-a44b14b19a9d`, HTTP 200, sent 2026-10-25T02:41:48.055Z) | data: `{"change_multiple_column_values":{"id":"13374290733"}}` |
| Clear A's own rollup cells (null) | `captures/18-clear-a-2026-10.json` (request_id `7f0aee59-ef28-92b5-b360-4bed26e0d437`, HTTP 200, sent 2026-10-25T02:41:50.302Z) | data: `{"change_multiple_column_values":{"id":"13374271723"}}` |

### Reads

- Before: `captures/13-before-2026-10.json` (request_id `b6533f54-d0e6-9f5a-b386-88336ada7a2e`, HTTP 200, sent 2026-10-25T02:41:40.111Z)
- After, read 1: `captures/16-after-2026-10.json` (request_id `544c4d8f-2753-94bf-9de0-1493bb0e411a`, HTTP 200, sent 2026-10-25T02:41:46.196Z)
- Restore, read 1: `captures/19-restore-2026-10.json` (request_id `e4523244-cc65-9885-9aee-a44424707f15`, HTTP 200, sent 2026-10-25T02:41:52.432Z)

### Parent values

Leaves: the leaf values under the parent (ground truth). Expected: the column's function over the leaves, per the documentation. Own values: what was written to R1's and A's own cells in this parent's subtree, the parent's own first. Model: the function the API applies to this column type (numbers SUM, date MIN, timeline MIN_MAX; see `../rollup-function/`) over the leaves and the own values. Board UI: the reading from a board screenshot taken on 2026-10-24 after the same write on the same board (`fixture.json`, `boardUi`).

| Parent | Column | Leaves | Expected per docs | Board UI | API before | Own values | API after | Model with own values | API after clear | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| R1 | Num SUM | 100, 11, 25 | 136 | 136 | 136 | 5, 1000 | 1141 | 1141 | 136 | DEVIATES: own values counted |
| R1 | Num MIN | 100, 11, 25 | 11 | 11 | 136 | 2, 1 | 139 | 139 | 136 | DEVIATES: own values counted |
| R1 | Num MAX | 100, 11, 25 | 100 | 100 | 136 | 500, 999 | 1635 | 1635 | 136 | DEVIATES: own values counted |
| R1 | Num NONE | 100, 11, 25 | empty | empty | 136 | 5, 1000 | 1141 | 1141 | 136 | DEVIATES: own values counted |
| R1 | Date MIN | 2026-01-10, 2026-03-02, 2026-05-15 | 2026-01-10 | Jan 10 | 2026-01-10 | 2020-01-01, 2019-01-01 | 2019-01-01 | 2019-01-01 | 2026-01-10 | DEVIATES: own values counted |
| R1 | Date MAX | 2026-01-10, 2026-03-02, 2026-05-15 | 2026-05-15 | May 15 | 2026-01-10 | 2030-01-01, 2031-01-01 | 2026-01-10 | 2026-01-10 | 2026-01-10 | unchanged: own values cannot move the API's function here |
| R1 | Timeline | 2026-01-05 - 2026-01-12, 2026-03-01 - 2026-03-10, 2026-05-01 - 2026-05-20 | 2026-01-05 - 2026-05-20 | Jan 5 - May 20 | 2026-01-05 - 2026-05-20 | 2020-01-01 - 2030-01-01, 2019-01-01 - 2031-01-01 | 2019-01-01 - 2031-01-01 | 2019-01-01 - 2031-01-01 | 2026-01-05 - 2026-05-20 | DEVIATES: own values counted |
| A | Num SUM | 11, 25 | 36 | 36 | 36 | 1000 | 1036 | 1036 | 36 | DEVIATES: own values counted |
| A | Num MIN | 11, 25 | 11 | 11 | 36 | 1 | 37 | 37 | 36 | DEVIATES: own values counted |
| A | Num MAX | 11, 25 | 25 | 25 | 36 | 999 | 1035 | 1035 | 36 | DEVIATES: own values counted |
| A | Num NONE | 11, 25 | empty | empty | 36 | 1000 | 1036 | 1036 | 36 | DEVIATES: own values counted |
| A | Date MIN | 2026-03-02, 2026-05-15 | 2026-03-02 | Mar 2 | 2026-03-02 | 2019-01-01 | 2019-01-01 | 2019-01-01 | 2026-03-02 | DEVIATES: own values counted |
| A | Date MAX | 2026-03-02, 2026-05-15 | 2026-05-15 | May 15 | 2026-03-02 | 2031-01-01 | 2026-03-02 | 2026-03-02 | 2026-03-02 | unchanged: own values cannot move the API's function here |
| A | Timeline | 2026-03-01 - 2026-03-10, 2026-05-01 - 2026-05-20 | 2026-03-01 - 2026-05-20 | Mar 1 - May 20 | 2026-03-01 - 2026-05-20 | 2019-01-01 - 2031-01-01 | 2019-01-01 - 2031-01-01 | 2019-01-01 - 2031-01-01 | 2026-03-01 - 2026-05-20 | DEVIATES: own values counted |
