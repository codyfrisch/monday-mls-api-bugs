# Observed: rollup values ignore the configured function

Generated at 2026-10-25T02:43:45.767Z from the requests in `captures/`. "Expected per docs" is the column's configured function (`capabilities.calculated.function` from the metadata read) applied to the parent's leaf values; NONE predicts an empty cell. "Observed matches" lists every function whose result equals the observed value.

See [README.md](README.md#expected-behaviour-per-documentation) for the documentation quotes.

## Summary

| Board | API version | Read | Parent | Column | Function | Expected | Observed | Matches | Verdict | request_id |
|---|---|---|---|---|---|---|---|---|---|---|
| fresh | 2026-04 | first | Q1 (L2 parent) | Num SUM | SUM | `47` | `47` | SUM | PASS | `bfb67146-0851-9e07-9da0-382e5165449a` |
| fresh | 2026-04 | first | Q1 (L2 parent) | Num MIN | MIN | `7` | `47` | SUM | DEVIATES | `bfb67146-0851-9e07-9da0-382e5165449a` |
| fresh | 2026-04 | first | Q1 (L2 parent) | Num MAX | MAX | `40` | `47` | SUM | DEVIATES | `bfb67146-0851-9e07-9da0-382e5165449a` |
| fresh | 2026-04 | first | Q1 (L2 parent) | Num NONE | NONE | empty | `47` | SUM | DEVIATES | `bfb67146-0851-9e07-9da0-382e5165449a` |
| fresh | 2026-04 | first | Q1 (L2 parent) | Date MIN | MIN | `2026-03-03` | `2026-03-03` | MIN | PASS | `bfb67146-0851-9e07-9da0-382e5165449a` |
| fresh | 2026-04 | first | Q1 (L2 parent) | Date MAX | MAX | `2026-06-30` | `2026-03-03` | MIN | DEVIATES | `bfb67146-0851-9e07-9da0-382e5165449a` |
| fresh | 2026-04 | first | Q1 (L2 parent) | Date default | MIN | `2026-03-03` | `2026-03-03` | MIN | PASS | `bfb67146-0851-9e07-9da0-382e5165449a` |
| fresh | 2026-04 | first | Q1 (L2 parent) | Timeline MIN_MAX | MIN_MAX | `2026-03-01..2026-07-15` | `2026-03-01..2026-07-15` | MIN_MAX | PASS | `bfb67146-0851-9e07-9da0-382e5165449a` |
| fresh | 2026-04 | first | P1 (L1 parent) | Num SUM | SUM | `247` | `247` | SUM | PASS | `bfb67146-0851-9e07-9da0-382e5165449a` |
| fresh | 2026-04 | first | P1 (L1 parent) | Num MIN | MIN | `7` | `247` | SUM | DEVIATES | `bfb67146-0851-9e07-9da0-382e5165449a` |
| fresh | 2026-04 | first | P1 (L1 parent) | Num MAX | MAX | `200` | `247` | SUM | DEVIATES | `bfb67146-0851-9e07-9da0-382e5165449a` |
| fresh | 2026-04 | first | P1 (L1 parent) | Num NONE | NONE | empty | `247` | SUM | DEVIATES | `bfb67146-0851-9e07-9da0-382e5165449a` |
| fresh | 2026-04 | first | P1 (L1 parent) | Date MIN | MIN | `2026-01-20` | `2026-01-20` | MIN | PASS | `bfb67146-0851-9e07-9da0-382e5165449a` |
| fresh | 2026-04 | first | P1 (L1 parent) | Date MAX | MAX | `2026-06-30` | `2026-01-20` | MIN | DEVIATES | `bfb67146-0851-9e07-9da0-382e5165449a` |
| fresh | 2026-04 | first | P1 (L1 parent) | Date default | MIN | `2026-01-20` | `2026-01-20` | MIN | PASS | `bfb67146-0851-9e07-9da0-382e5165449a` |
| fresh | 2026-04 | first | P1 (L1 parent) | Timeline MIN_MAX | MIN_MAX | `2026-01-10..2026-07-15` | `2026-01-10..2026-07-15` | MIN_MAX | PASS | `bfb67146-0851-9e07-9da0-382e5165449a` |
| fresh | 2026-10 | first | Q1 (L2 parent) | Num SUM | SUM | `47` | `47` | SUM | PASS | `42af85e7-d2dc-94ae-aeeb-d324ce506ecc` |
| fresh | 2026-10 | first | Q1 (L2 parent) | Num MIN | MIN | `7` | `47` | SUM | DEVIATES | `42af85e7-d2dc-94ae-aeeb-d324ce506ecc` |
| fresh | 2026-10 | first | Q1 (L2 parent) | Num MAX | MAX | `40` | `47` | SUM | DEVIATES | `42af85e7-d2dc-94ae-aeeb-d324ce506ecc` |
| fresh | 2026-10 | first | Q1 (L2 parent) | Num NONE | NONE | empty | `47` | SUM | DEVIATES | `42af85e7-d2dc-94ae-aeeb-d324ce506ecc` |
| fresh | 2026-10 | first | Q1 (L2 parent) | Date MIN | MIN | `2026-03-03` | `2026-03-03` | MIN | PASS | `42af85e7-d2dc-94ae-aeeb-d324ce506ecc` |
| fresh | 2026-10 | first | Q1 (L2 parent) | Date MAX | MAX | `2026-06-30` | `2026-03-03` | MIN | DEVIATES | `42af85e7-d2dc-94ae-aeeb-d324ce506ecc` |
| fresh | 2026-10 | first | Q1 (L2 parent) | Date default | MIN | `2026-03-03` | `2026-03-03` | MIN | PASS | `42af85e7-d2dc-94ae-aeeb-d324ce506ecc` |
| fresh | 2026-10 | first | Q1 (L2 parent) | Timeline MIN_MAX | MIN_MAX | `2026-03-01..2026-07-15` | `2026-03-01..2026-07-15` | MIN_MAX | PASS | `42af85e7-d2dc-94ae-aeeb-d324ce506ecc` |
| fresh | 2026-10 | first | P1 (L1 parent) | Num SUM | SUM | `247` | `247` | SUM | PASS | `42af85e7-d2dc-94ae-aeeb-d324ce506ecc` |
| fresh | 2026-10 | first | P1 (L1 parent) | Num MIN | MIN | `7` | `247` | SUM | DEVIATES | `42af85e7-d2dc-94ae-aeeb-d324ce506ecc` |
| fresh | 2026-10 | first | P1 (L1 parent) | Num MAX | MAX | `200` | `247` | SUM | DEVIATES | `42af85e7-d2dc-94ae-aeeb-d324ce506ecc` |
| fresh | 2026-10 | first | P1 (L1 parent) | Num NONE | NONE | empty | `247` | SUM | DEVIATES | `42af85e7-d2dc-94ae-aeeb-d324ce506ecc` |
| fresh | 2026-10 | first | P1 (L1 parent) | Date MIN | MIN | `2026-01-20` | `2026-01-20` | MIN | PASS | `42af85e7-d2dc-94ae-aeeb-d324ce506ecc` |
| fresh | 2026-10 | first | P1 (L1 parent) | Date MAX | MAX | `2026-06-30` | `2026-01-20` | MIN | DEVIATES | `42af85e7-d2dc-94ae-aeeb-d324ce506ecc` |
| fresh | 2026-10 | first | P1 (L1 parent) | Date default | MIN | `2026-01-20` | `2026-01-20` | MIN | PASS | `42af85e7-d2dc-94ae-aeeb-d324ce506ecc` |
| fresh | 2026-10 | first | P1 (L1 parent) | Timeline MIN_MAX | MIN_MAX | `2026-01-10..2026-07-15` | `2026-01-10..2026-07-15` | MIN_MAX | PASS | `42af85e7-d2dc-94ae-aeeb-d324ce506ecc` |
| sandbox | 2026-04 | first | A2x (L4) | Timeline | MIN_MAX | `2026-05-01..2026-05-20` | `2026-05-01..2026-05-20` | MIN_MAX | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A2x (L4) | Num SUM | SUM | `25` | `25` | SUM, MIN, MAX | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A2x (L4) | Num MIN | MIN | `25` | `25` | SUM, MIN, MAX | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A2x (L4) | Num MAX | MAX | `25` | `25` | SUM, MIN, MAX | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A2x (L4) | Num NONE | NONE | empty | `25` | SUM, MIN, MAX | DEVIATES | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A2x (L4) | Date MAX | MAX | `2026-05-15` | `2026-05-15` | MIN, MAX | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A2x (L4) | Date MIN | MIN | `2026-05-15` | `2026-05-15` | MIN, MAX | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A2 (L3) | Timeline | MIN_MAX | `2026-05-01..2026-05-20` | `2026-05-01..2026-05-20` | MIN_MAX | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A2 (L3) | Num SUM | SUM | `25` | `25` | SUM, MIN, MAX | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A2 (L3) | Num MIN | MIN | `25` | `25` | SUM, MIN, MAX | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A2 (L3) | Num MAX | MAX | `25` | `25` | SUM, MIN, MAX | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A2 (L3) | Num NONE | NONE | empty | `25` | SUM, MIN, MAX | DEVIATES | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A2 (L3) | Date MAX | MAX | `2026-05-15` | `2026-05-15` | MIN, MAX | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A2 (L3) | Date MIN | MIN | `2026-05-15` | `2026-05-15` | MIN, MAX | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | R3 empty-child root | Timeline | MIN_MAX | empty | empty | MIN_MAX, NONE | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | R3 empty-child root | Num SUM | SUM | empty | empty | SUM, MIN, MAX, NONE | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | R3 empty-child root | Num MIN | MIN | empty | empty | SUM, MIN, MAX, NONE | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | R3 empty-child root | Num MAX | MAX | empty | empty | SUM, MIN, MAX, NONE | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | R3 empty-child root | Num NONE | NONE | empty | empty | SUM, MIN, MAX, NONE | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | R3 empty-child root | Date MAX | MAX | empty | empty | MIN, MAX, NONE | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | R3 empty-child root | Date MIN | MIN | empty | empty | MIN, MAX, NONE | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A (L2) | Timeline | MIN_MAX | `2026-03-01..2026-05-20` | `2026-03-01..2026-05-20` | MIN_MAX | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A (L2) | Num SUM | SUM | `36` | `36` | SUM | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A (L2) | Num MIN | MIN | `11` | `36` | SUM | DEVIATES | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A (L2) | Num MAX | MAX | `25` | `36` | SUM | DEVIATES | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A (L2) | Num NONE | NONE | empty | `36` | SUM | DEVIATES | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A (L2) | Date MAX | MAX | `2026-05-15` | `2026-03-02` | MIN | DEVIATES | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | A (L2) | Date MIN | MIN | `2026-03-02` | `2026-03-02` | MIN | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | R1 root | Timeline | MIN_MAX | `2026-01-05..2026-05-20` | `2026-01-05..2026-05-20` | MIN_MAX | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | R1 root | Num SUM | SUM | `136` | `136` | SUM | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | R1 root | Num MIN | MIN | `11` | `136` | SUM | DEVIATES | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | R1 root | Num MAX | MAX | `100` | `136` | SUM | DEVIATES | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | R1 root | Num NONE | NONE | empty | `136` | SUM | DEVIATES | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | R1 root | Date MAX | MAX | `2026-05-15` | `2026-01-10` | MIN | DEVIATES | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-04 | first | R1 root | Date MIN | MIN | `2026-01-10` | `2026-01-10` | MIN | PASS | `b83b69b4-fad9-9e0d-bdb4-a44aab373b46` |
| sandbox | 2026-10 | first | A2x (L4) | Timeline | MIN_MAX | `2026-05-01..2026-05-20` | `2026-05-01..2026-05-20` | MIN_MAX | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A2x (L4) | Num SUM | SUM | `25` | `25` | SUM, MIN, MAX | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A2x (L4) | Num MIN | MIN | `25` | `25` | SUM, MIN, MAX | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A2x (L4) | Num MAX | MAX | `25` | `25` | SUM, MIN, MAX | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A2x (L4) | Num NONE | NONE | empty | `25` | SUM, MIN, MAX | DEVIATES | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A2x (L4) | Date MAX | MAX | `2026-05-15` | `2026-05-15` | MIN, MAX | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A2x (L4) | Date MIN | MIN | `2026-05-15` | `2026-05-15` | MIN, MAX | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A2 (L3) | Timeline | MIN_MAX | `2026-05-01..2026-05-20` | `2026-05-01..2026-05-20` | MIN_MAX | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A2 (L3) | Num SUM | SUM | `25` | `25` | SUM, MIN, MAX | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A2 (L3) | Num MIN | MIN | `25` | `25` | SUM, MIN, MAX | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A2 (L3) | Num MAX | MAX | `25` | `25` | SUM, MIN, MAX | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A2 (L3) | Num NONE | NONE | empty | `25` | SUM, MIN, MAX | DEVIATES | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A2 (L3) | Date MAX | MAX | `2026-05-15` | `2026-05-15` | MIN, MAX | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A2 (L3) | Date MIN | MIN | `2026-05-15` | `2026-05-15` | MIN, MAX | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | R3 empty-child root | Timeline | MIN_MAX | empty | empty | MIN_MAX, NONE | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | R3 empty-child root | Num SUM | SUM | empty | empty | SUM, MIN, MAX, NONE | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | R3 empty-child root | Num MIN | MIN | empty | empty | SUM, MIN, MAX, NONE | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | R3 empty-child root | Num MAX | MAX | empty | empty | SUM, MIN, MAX, NONE | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | R3 empty-child root | Num NONE | NONE | empty | empty | SUM, MIN, MAX, NONE | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | R3 empty-child root | Date MAX | MAX | empty | empty | MIN, MAX, NONE | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | R3 empty-child root | Date MIN | MIN | empty | empty | MIN, MAX, NONE | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A (L2) | Timeline | MIN_MAX | `2026-03-01..2026-05-20` | `2026-03-01..2026-05-20` | MIN_MAX | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A (L2) | Num SUM | SUM | `36` | `36` | SUM | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A (L2) | Num MIN | MIN | `11` | `36` | SUM | DEVIATES | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A (L2) | Num MAX | MAX | `25` | `36` | SUM | DEVIATES | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A (L2) | Num NONE | NONE | empty | `36` | SUM | DEVIATES | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A (L2) | Date MAX | MAX | `2026-05-15` | `2026-03-02` | MIN | DEVIATES | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | A (L2) | Date MIN | MIN | `2026-03-02` | `2026-03-02` | MIN | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | R1 root | Timeline | MIN_MAX | `2026-01-05..2026-05-20` | `2026-01-05..2026-05-20` | MIN_MAX | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | R1 root | Num SUM | SUM | `136` | `136` | SUM | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | R1 root | Num MIN | MIN | `11` | `136` | SUM | DEVIATES | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | R1 root | Num MAX | MAX | `100` | `136` | SUM | DEVIATES | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | R1 root | Num NONE | NONE | empty | `136` | SUM | DEVIATES | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | R1 root | Date MAX | MAX | `2026-05-15` | `2026-01-10` | MIN | DEVIATES | `a680c196-9e91-9007-8b8b-7333f4804efc` |
| sandbox | 2026-10 | first | R1 root | Date MIN | MIN | `2026-01-10` | `2026-01-10` | MIN | PASS | `a680c196-9e91-9007-8b8b-7333f4804efc` |

## Fresh board `18436908354` ("R4 rollup function evidence 2026-10-25T02:42:12.568Z")

### Setup requests

| Step | File | HTTP | request_id | Errors |
|---|---|---|---|---|
| Account slug | `captures/01-account-2026-10.json` | 200 | `166e5ca0-b9b4-97cd-ae49-c4b353bd655e` | none |
| create_board (use_mls_template, empty) | `captures/02-create-board-2026-10.json` | 200 | `b17ace37-25ac-9f1a-b0bb-2bfa2f3d8386` | none |
| create_column Num SUM | `captures/03-create-column-numsum-2026-10.json` | 200 | `42ee5665-8100-9c09-b5e9-21b17ff2198f` | none |
| create_column Num MIN | `captures/04-create-column-nummin-2026-10.json` | 200 | `ca18cd2b-e542-9de3-a3c0-c2e51ddb1ae0` | none |
| create_column Num MAX | `captures/05-create-column-nummax-2026-10.json` | 200 | `540141df-6bf2-9af9-8578-4397f14f3420` | none |
| create_column Num NONE | `captures/06-create-column-numnone-2026-10.json` | 200 | `c7756879-d964-9c7d-ad0e-cbf8f3b95447` | none |
| create_column Date MIN | `captures/07-create-column-datemin-2026-10.json` | 200 | `427167a4-52a1-9496-8e37-f769bf6f9f37` | none |
| create_column Date MAX | `captures/08-create-column-datemax-2026-10.json` | 200 | `cf8a56a6-92f3-9cb4-a477-38be7606fd8a` | none |
| create_column Date NONE | `captures/09-create-column-datenone-2026-10.json` | 200 | `82e57958-c4ae-94de-8a16-3a569147b01c` | `[["Invalid capabilities: Invalid calculated function 'none' for column type 'date'. Valid functions: min, max"]]` |
| create_column Date default | `captures/10-create-column-datedefault-2026-10.json` | 200 | `1f7ab603-34c8-9f1f-952b-eb6eb6c5dd28` | none |
| create_column Timeline MIN_MAX | `captures/11-create-column-timeline-2026-10.json` | 200 | `8de06e9f-9caf-94b9-8fc2-224290f7a601` | none |
| create_item P1 (L1 parent) | `captures/12-create-item-p1-2026-10.json` | 200 | `61a4272b-8f8f-9114-9b87-4bb3e0855712` | none |
| create_subitem Q1 (L2 parent) | `captures/13-create-subitem-q1-2026-10.json` | 200 | `c7889bcd-a841-9300-9cf3-9f3fa202face` | none |
| create_subitem Q1a (L3 leaf) | `captures/14-create-subitem-q1a-2026-10.json` | 200 | `575c0c5e-85de-983b-b261-0c11211c82f9` | none |
| create_subitem Q1b (L3 leaf) | `captures/15-create-subitem-q1b-2026-10.json` | 200 | `053c1a59-4f60-9301-8545-53c164907252` | none |
| create_subitem P1c (L2 leaf) | `captures/16-create-subitem-p1c-2026-10.json` | 200 | `9f72cf2c-dcf7-9236-ad40-12b57e85c487` | none |
| write leaf Q1a | `captures/17-write-leaf-q1a-2026-10.json` | 200 | `b3a11a98-a57e-91fd-b5f5-c24bbca27ae3` | none |
| write leaf Q1b | `captures/18-write-leaf-q1b-2026-10.json` | 200 | `1bba4a26-21c0-9365-b8a2-b793b6d68b74` | none |
| write leaf P1c | `captures/19-write-leaf-p1c-2026-10.json` | 200 | `4570f53c-c203-9ca3-addd-1c31e07f2060` | none |

### Fresh board, API-Version 2026-04

Column metadata. File `captures/20-fresh-metadata-2026-04.json`. request_id `eaa4fb72-81f3-9ef9-9d0c-307d8b507191`, x-request-id `eaa4fb72-81f3-9ef9-9d0c-307d8b507191`, sent 2026-10-25T02:43:10.642Z, HTTP 200.

| Column id | Title | Type | `capabilities.calculated.function` | `settings` | `settings_str` |
|---|---|---|---|---|---|
| `numeric_mm8fkv6k` | Num SUM | numbers | SUM | `{}` | `{}` |
| `numeric_mm8f3jz3` | Num MIN | numbers | MIN | `{}` | `{}` |
| `numeric_mm8f56kg` | Num MAX | numbers | MAX | `{}` | `{}` |
| `numeric_mm8fbpj2` | Num NONE | numbers | NONE | `{}` | `{}` |
| `date_mm8fftdz` | Date MIN | date | MIN | `{}` | `{}` |
| `date_mm8fswrb` | Date MAX | date | MAX | `{}` | `{}` |
| `date_mm8f2n8y` | Date default | date | MIN | `{}` | `{}` |
| `timerange_mm8fcct0` | Timeline MIN_MAX | timeline | MIN_MAX | `{}` | `{}` |

Ground truth (every item's `parent_item` and values). File `captures/21-fresh-ground-truth-2026-04.json`. request_id `02939a96-fe18-99a7-9072-547cd332c97a`, x-request-id `02939a96-fe18-99a7-9072-547cd332c97a`, sent 2026-10-25T02:43:12.210Z, HTTP 200.

Leaves return their own value:

| Leaf | Column | Written | Read | is_leaf | Verdict |
|---|---|---|---|---|---|
| Q1a | Num SUM | `40` | `40` | true | PASS |
| Q1a | Num MIN | `40` | `40` | true | PASS |
| Q1a | Num MAX | `40` | `40` | true | PASS |
| Q1a | Num NONE | `40` | `40` | true | PASS |
| Q1a | Date MIN | `2026-03-03` | `2026-03-03` | true | PASS |
| Q1a | Date MAX | `2026-03-03` | `2026-03-03` | true | PASS |
| Q1a | Date default | `2026-03-03` | `2026-03-03` | true | PASS |
| Q1a | Timeline MIN_MAX | `2026-03-01..2026-03-20` | `2026-03-01..2026-03-20` | true | PASS |
| Q1b | Num SUM | `7` | `7` | true | PASS |
| Q1b | Num MIN | `7` | `7` | true | PASS |
| Q1b | Num MAX | `7` | `7` | true | PASS |
| Q1b | Num NONE | `7` | `7` | true | PASS |
| Q1b | Date MIN | `2026-06-30` | `2026-06-30` | true | PASS |
| Q1b | Date MAX | `2026-06-30` | `2026-06-30` | true | PASS |
| Q1b | Date default | `2026-06-30` | `2026-06-30` | true | PASS |
| Q1b | Timeline MIN_MAX | `2026-05-01..2026-07-15` | `2026-05-01..2026-07-15` | true | PASS |
| P1c | Num SUM | `200` | `200` | true | PASS |
| P1c | Num MIN | `200` | `200` | true | PASS |
| P1c | Num MAX | `200` | `200` | true | PASS |
| P1c | Num NONE | `200` | `200` | true | PASS |
| P1c | Date MIN | `2026-01-20` | `2026-01-20` | true | PASS |
| P1c | Date MAX | `2026-01-20` | `2026-01-20` | true | PASS |
| P1c | Date default | `2026-01-20` | `2026-01-20` | true | PASS |
| P1c | Timeline MIN_MAX | `2026-01-10..2026-02-01` | `2026-01-10..2026-02-01` | true | PASS |

Parents. File `captures/22-fresh-parents-2026-04.json`. request_id `bfb67146-0851-9e07-9da0-382e5165449a`, x-request-id `bfb67146-0851-9e07-9da0-382e5165449a`, sent 2026-10-25T02:43:14.664Z, HTTP 200.

| Parent | Column | Configured function | Leaf values | Expected per docs | Observed | is_leaf | Observed matches | Verdict |
|---|---|---|---|---|---|---|---|---|
| Q1 (L2 parent) `13377349365` (L2) | Num SUM | SUM | 40, 7 | `47` | `47` | false | SUM | PASS |
| Q1 (L2 parent) `13377349365` (L2) | Num MIN | MIN | 40, 7 | `7` | `47` | false | SUM | DEVIATES |
| Q1 (L2 parent) `13377349365` (L2) | Num MAX | MAX | 40, 7 | `40` | `47` | false | SUM | DEVIATES |
| Q1 (L2 parent) `13377349365` (L2) | Num NONE | NONE | 40, 7 | empty | `47` | false | SUM | DEVIATES |
| Q1 (L2 parent) `13377349365` (L2) | Date MIN | MIN | 2026-03-03, 2026-06-30 | `2026-03-03` | `2026-03-03` | false | MIN | PASS |
| Q1 (L2 parent) `13377349365` (L2) | Date MAX | MAX | 2026-03-03, 2026-06-30 | `2026-06-30` | `2026-03-03` | false | MIN | DEVIATES |
| Q1 (L2 parent) `13377349365` (L2) | Date default | MIN | 2026-03-03, 2026-06-30 | `2026-03-03` | `2026-03-03` | false | MIN | PASS |
| Q1 (L2 parent) `13377349365` (L2) | Timeline MIN_MAX | MIN_MAX | 2026-03-01..2026-03-20, 2026-05-01..2026-07-15 | `2026-03-01..2026-07-15` | `2026-03-01..2026-07-15` | false | MIN_MAX | PASS |
| P1 (L1 parent) `13377371463` (L1) | Num SUM | SUM | 40, 7, 200 | `247` | `247` | false | SUM | PASS |
| P1 (L1 parent) `13377371463` (L1) | Num MIN | MIN | 40, 7, 200 | `7` | `247` | false | SUM | DEVIATES |
| P1 (L1 parent) `13377371463` (L1) | Num MAX | MAX | 40, 7, 200 | `200` | `247` | false | SUM | DEVIATES |
| P1 (L1 parent) `13377371463` (L1) | Num NONE | NONE | 40, 7, 200 | empty | `247` | false | SUM | DEVIATES |
| P1 (L1 parent) `13377371463` (L1) | Date MIN | MIN | 2026-03-03, 2026-06-30, 2026-01-20 | `2026-01-20` | `2026-01-20` | false | MIN | PASS |
| P1 (L1 parent) `13377371463` (L1) | Date MAX | MAX | 2026-03-03, 2026-06-30, 2026-01-20 | `2026-06-30` | `2026-01-20` | false | MIN | DEVIATES |
| P1 (L1 parent) `13377371463` (L1) | Date default | MIN | 2026-03-03, 2026-06-30, 2026-01-20 | `2026-01-20` | `2026-01-20` | false | MIN | PASS |
| P1 (L1 parent) `13377371463` (L1) | Timeline MIN_MAX | MIN_MAX | 2026-03-01..2026-03-20, 2026-05-01..2026-07-15, 2026-01-10..2026-02-01 | `2026-01-10..2026-07-15` | `2026-01-10..2026-07-15` | false | MIN_MAX | PASS |

Re-read. File `captures/26-fresh-parents-reread-2026-04.json`. request_id `8f4693c6-9246-97d3-a78c-42ec08065898`, x-request-id `8f4693c6-9246-97d3-a78c-42ec08065898`, sent 2026-10-25T02:43:32.300Z, HTTP 200. Every observed value equals the first read.

### Fresh board, API-Version 2026-10

Column metadata. File `captures/23-fresh-metadata-2026-10.json`. request_id `dbc00389-2bab-9932-8e46-da133a4cb2fe`, x-request-id `dbc00389-2bab-9932-8e46-da133a4cb2fe`, sent 2026-10-25T02:43:16.523Z, HTTP 200.

| Column id | Title | Type | `capabilities.calculated.function` | `settings` | `settings_str` |
|---|---|---|---|---|---|
| `numeric_mm8fkv6k` | Num SUM | numbers | SUM | `{}` | `{}` |
| `numeric_mm8f3jz3` | Num MIN | numbers | MIN | `{}` | `{}` |
| `numeric_mm8f56kg` | Num MAX | numbers | MAX | `{}` | `{}` |
| `numeric_mm8fbpj2` | Num NONE | numbers | NONE | `{}` | `{}` |
| `date_mm8fftdz` | Date MIN | date | MIN | `{}` | `{}` |
| `date_mm8fswrb` | Date MAX | date | MAX | `{}` | `{}` |
| `date_mm8f2n8y` | Date default | date | MIN | `{}` | `{}` |
| `timerange_mm8fcct0` | Timeline MIN_MAX | timeline | MIN_MAX | `{}` | `{}` |

Ground truth (every item's `parent_item` and values). File `captures/24-fresh-ground-truth-2026-10.json`. request_id `d9e2efc6-83c6-91ec-ae34-4fcbef5de4fb`, x-request-id `d9e2efc6-83c6-91ec-ae34-4fcbef5de4fb`, sent 2026-10-25T02:43:18.152Z, HTTP 200.

Leaves return their own value:

| Leaf | Column | Written | Read | is_leaf | Verdict |
|---|---|---|---|---|---|
| Q1a | Num SUM | `40` | `40` | true | PASS |
| Q1a | Num MIN | `40` | `40` | true | PASS |
| Q1a | Num MAX | `40` | `40` | true | PASS |
| Q1a | Num NONE | `40` | `40` | true | PASS |
| Q1a | Date MIN | `2026-03-03` | `2026-03-03` | true | PASS |
| Q1a | Date MAX | `2026-03-03` | `2026-03-03` | true | PASS |
| Q1a | Date default | `2026-03-03` | `2026-03-03` | true | PASS |
| Q1a | Timeline MIN_MAX | `2026-03-01..2026-03-20` | `2026-03-01..2026-03-20` | true | PASS |
| Q1b | Num SUM | `7` | `7` | true | PASS |
| Q1b | Num MIN | `7` | `7` | true | PASS |
| Q1b | Num MAX | `7` | `7` | true | PASS |
| Q1b | Num NONE | `7` | `7` | true | PASS |
| Q1b | Date MIN | `2026-06-30` | `2026-06-30` | true | PASS |
| Q1b | Date MAX | `2026-06-30` | `2026-06-30` | true | PASS |
| Q1b | Date default | `2026-06-30` | `2026-06-30` | true | PASS |
| Q1b | Timeline MIN_MAX | `2026-05-01..2026-07-15` | `2026-05-01..2026-07-15` | true | PASS |
| P1c | Num SUM | `200` | `200` | true | PASS |
| P1c | Num MIN | `200` | `200` | true | PASS |
| P1c | Num MAX | `200` | `200` | true | PASS |
| P1c | Num NONE | `200` | `200` | true | PASS |
| P1c | Date MIN | `2026-01-20` | `2026-01-20` | true | PASS |
| P1c | Date MAX | `2026-01-20` | `2026-01-20` | true | PASS |
| P1c | Date default | `2026-01-20` | `2026-01-20` | true | PASS |
| P1c | Timeline MIN_MAX | `2026-01-10..2026-02-01` | `2026-01-10..2026-02-01` | true | PASS |

Parents. File `captures/25-fresh-parents-2026-10.json`. request_id `42af85e7-d2dc-94ae-aeeb-d324ce506ecc`, x-request-id `42af85e7-d2dc-94ae-aeeb-d324ce506ecc`, sent 2026-10-25T02:43:20.505Z, HTTP 200.

| Parent | Column | Configured function | Leaf values | Expected per docs | Observed | is_leaf | Observed matches | Verdict |
|---|---|---|---|---|---|---|---|---|
| Q1 (L2 parent) `13377349365` (L2) | Num SUM | SUM | 40, 7 | `47` | `47` | false | SUM | PASS |
| Q1 (L2 parent) `13377349365` (L2) | Num MIN | MIN | 40, 7 | `7` | `47` | false | SUM | DEVIATES |
| Q1 (L2 parent) `13377349365` (L2) | Num MAX | MAX | 40, 7 | `40` | `47` | false | SUM | DEVIATES |
| Q1 (L2 parent) `13377349365` (L2) | Num NONE | NONE | 40, 7 | empty | `47` | false | SUM | DEVIATES |
| Q1 (L2 parent) `13377349365` (L2) | Date MIN | MIN | 2026-03-03, 2026-06-30 | `2026-03-03` | `2026-03-03` | false | MIN | PASS |
| Q1 (L2 parent) `13377349365` (L2) | Date MAX | MAX | 2026-03-03, 2026-06-30 | `2026-06-30` | `2026-03-03` | false | MIN | DEVIATES |
| Q1 (L2 parent) `13377349365` (L2) | Date default | MIN | 2026-03-03, 2026-06-30 | `2026-03-03` | `2026-03-03` | false | MIN | PASS |
| Q1 (L2 parent) `13377349365` (L2) | Timeline MIN_MAX | MIN_MAX | 2026-03-01..2026-03-20, 2026-05-01..2026-07-15 | `2026-03-01..2026-07-15` | `2026-03-01..2026-07-15` | false | MIN_MAX | PASS |
| P1 (L1 parent) `13377371463` (L1) | Num SUM | SUM | 40, 7, 200 | `247` | `247` | false | SUM | PASS |
| P1 (L1 parent) `13377371463` (L1) | Num MIN | MIN | 40, 7, 200 | `7` | `247` | false | SUM | DEVIATES |
| P1 (L1 parent) `13377371463` (L1) | Num MAX | MAX | 40, 7, 200 | `200` | `247` | false | SUM | DEVIATES |
| P1 (L1 parent) `13377371463` (L1) | Num NONE | NONE | 40, 7, 200 | empty | `247` | false | SUM | DEVIATES |
| P1 (L1 parent) `13377371463` (L1) | Date MIN | MIN | 2026-03-03, 2026-06-30, 2026-01-20 | `2026-01-20` | `2026-01-20` | false | MIN | PASS |
| P1 (L1 parent) `13377371463` (L1) | Date MAX | MAX | 2026-03-03, 2026-06-30, 2026-01-20 | `2026-06-30` | `2026-01-20` | false | MIN | DEVIATES |
| P1 (L1 parent) `13377371463` (L1) | Date default | MIN | 2026-03-03, 2026-06-30, 2026-01-20 | `2026-01-20` | `2026-01-20` | false | MIN | PASS |
| P1 (L1 parent) `13377371463` (L1) | Timeline MIN_MAX | MIN_MAX | 2026-03-01..2026-03-20, 2026-05-01..2026-07-15, 2026-01-10..2026-02-01 | `2026-01-10..2026-07-15` | `2026-01-10..2026-07-15` | false | MIN_MAX | PASS |

Re-read. File `captures/27-fresh-parents-reread-2026-10.json`. request_id `e9c6d5cc-b2e2-9a3f-81b7-0079cc28b1ad`, x-request-id `e9c6d5cc-b2e2-9a3f-81b7-0079cc28b1ad`, sent 2026-10-25T02:43:34.267Z, HTTP 200. Every observed value equals the first read.

## Sandbox board (MLS Source)

Reads only; nothing on this board was written. Captured on attempt 1: R1's and A's Num SUM equal their leaves' sum in the captured ground truth, so no stored parent value (see `../parent-stored-value/`) was present. Every attempt's requests are in the bundle; the tables use the last.

### Sandbox, API-Version 2026-04

Column metadata. File `captures/28-sandbox-metadata-2026-04.json`. request_id `da5687fa-fd82-9995-b975-310d180d16df`, x-request-id `da5687fa-fd82-9995-b975-310d180d16df`, sent 2026-10-25T02:43:36.072Z, HTTP 200.

| Column id | Title | Type | `capabilities.calculated.function` | `settings` | `settings_str` |
|---|---|---|---|---|---|
| `timerange_mkyvnykb` | Timeline | timeline | MIN_MAX | `{}` | `{}` |
| `numeric_mm8er9xg` | Num SUM | numbers | SUM | `{}` | `{}` |
| `numeric_mm8esxg1` | Num MIN | numbers | MIN | `{}` | `{}` |
| `numeric_mm8e1qed` | Num MAX | numbers | MAX | `{}` | `{}` |
| `numeric_mm8e1myd` | Num NONE | numbers | NONE | `{}` | `{}` |
| `date_mm8es1zd` | Date MAX | date | MAX | `{}` | `{}` |
| `date_mm8e937y` | Date MIN | date | MIN | `{}` | `{}` |

Ground truth (every item's `parent_item` and values). File `captures/29-sandbox-ground-truth-2026-04.json`. request_id `3b38e8d1-8cd8-9ff3-8df8-4521a9565496`, x-request-id `3b38e8d1-8cd8-9ff3-8df8-4521a9565496`, sent 2026-10-25T02:43:37.554Z, HTTP 200.

Parents. File `captures/30-sandbox-parents-2026-04.json`. request_id `b83b69b4-fad9-9e0d-bdb4-a44aab373b46`, x-request-id `b83b69b4-fad9-9e0d-bdb4-a44aab373b46`, sent 2026-10-25T02:43:39.677Z, HTTP 200.

| Parent | Column | Configured function | Leaf values | Expected per docs | Observed | is_leaf | Observed matches | Verdict |
|---|---|---|---|---|---|---|---|---|
| A2x (L4) `13374242116` (L4) | Timeline | MIN_MAX | 2026-05-01..2026-05-20 | `2026-05-01..2026-05-20` | `2026-05-01..2026-05-20` | false | MIN_MAX | PASS |
| A2x (L4) `13374242116` (L4) | Num SUM | SUM | 25 | `25` | `25` | false | SUM, MIN, MAX | PASS |
| A2x (L4) `13374242116` (L4) | Num MIN | MIN | 25 | `25` | `25` | false | SUM, MIN, MAX | PASS |
| A2x (L4) `13374242116` (L4) | Num MAX | MAX | 25 | `25` | `25` | false | SUM, MIN, MAX | PASS |
| A2x (L4) `13374242116` (L4) | Num NONE | NONE | 25 | empty | `25` | false | SUM, MIN, MAX | DEVIATES |
| A2x (L4) `13374242116` (L4) | Date MAX | MAX | 2026-05-15 | `2026-05-15` | `2026-05-15` | false | MIN, MAX | PASS |
| A2x (L4) `13374242116` (L4) | Date MIN | MIN | 2026-05-15 | `2026-05-15` | `2026-05-15` | false | MIN, MAX | PASS |
| A2 (L3) `13374259848` (L3) | Timeline | MIN_MAX | 2026-05-01..2026-05-20 | `2026-05-01..2026-05-20` | `2026-05-01..2026-05-20` | false | MIN_MAX | PASS |
| A2 (L3) `13374259848` (L3) | Num SUM | SUM | 25 | `25` | `25` | false | SUM, MIN, MAX | PASS |
| A2 (L3) `13374259848` (L3) | Num MIN | MIN | 25 | `25` | `25` | false | SUM, MIN, MAX | PASS |
| A2 (L3) `13374259848` (L3) | Num MAX | MAX | 25 | `25` | `25` | false | SUM, MIN, MAX | PASS |
| A2 (L3) `13374259848` (L3) | Num NONE | NONE | 25 | empty | `25` | false | SUM, MIN, MAX | DEVIATES |
| A2 (L3) `13374259848` (L3) | Date MAX | MAX | 2026-05-15 | `2026-05-15` | `2026-05-15` | false | MIN, MAX | PASS |
| A2 (L3) `13374259848` (L3) | Date MIN | MIN | 2026-05-15 | `2026-05-15` | `2026-05-15` | false | MIN, MAX | PASS |
| R3 empty-child root `13374267172` (L1) | Timeline | MIN_MAX | none | empty | empty | false | MIN_MAX, NONE | PASS |
| R3 empty-child root `13374267172` (L1) | Num SUM | SUM | none | empty | empty | false | SUM, MIN, MAX, NONE | PASS |
| R3 empty-child root `13374267172` (L1) | Num MIN | MIN | none | empty | empty | false | SUM, MIN, MAX, NONE | PASS |
| R3 empty-child root `13374267172` (L1) | Num MAX | MAX | none | empty | empty | false | SUM, MIN, MAX, NONE | PASS |
| R3 empty-child root `13374267172` (L1) | Num NONE | NONE | none | empty | empty | false | SUM, MIN, MAX, NONE | PASS |
| R3 empty-child root `13374267172` (L1) | Date MAX | MAX | none | empty | empty | false | MIN, MAX, NONE | PASS |
| R3 empty-child root `13374267172` (L1) | Date MIN | MIN | none | empty | empty | false | MIN, MAX, NONE | PASS |
| A (L2) `13374271723` (L2) | Timeline | MIN_MAX | 2026-05-01..2026-05-20, 2026-03-01..2026-03-10 | `2026-03-01..2026-05-20` | `2026-03-01..2026-05-20` | false | MIN_MAX | PASS |
| A (L2) `13374271723` (L2) | Num SUM | SUM | 25, 11 | `36` | `36` | false | SUM | PASS |
| A (L2) `13374271723` (L2) | Num MIN | MIN | 25, 11 | `11` | `36` | false | SUM | DEVIATES |
| A (L2) `13374271723` (L2) | Num MAX | MAX | 25, 11 | `25` | `36` | false | SUM | DEVIATES |
| A (L2) `13374271723` (L2) | Num NONE | NONE | 25, 11 | empty | `36` | false | SUM | DEVIATES |
| A (L2) `13374271723` (L2) | Date MAX | MAX | 2026-05-15, 2026-03-02 | `2026-05-15` | `2026-03-02` | false | MIN | DEVIATES |
| A (L2) `13374271723` (L2) | Date MIN | MIN | 2026-05-15, 2026-03-02 | `2026-03-02` | `2026-03-02` | false | MIN | PASS |
| R1 root `13374290733` (L1) | Timeline | MIN_MAX | 2026-01-05..2026-01-12, 2026-05-01..2026-05-20, 2026-03-01..2026-03-10 | `2026-01-05..2026-05-20` | `2026-01-05..2026-05-20` | false | MIN_MAX | PASS |
| R1 root `13374290733` (L1) | Num SUM | SUM | 100, 25, 11 | `136` | `136` | false | SUM | PASS |
| R1 root `13374290733` (L1) | Num MIN | MIN | 100, 25, 11 | `11` | `136` | false | SUM | DEVIATES |
| R1 root `13374290733` (L1) | Num MAX | MAX | 100, 25, 11 | `100` | `136` | false | SUM | DEVIATES |
| R1 root `13374290733` (L1) | Num NONE | NONE | 100, 25, 11 | empty | `136` | false | SUM | DEVIATES |
| R1 root `13374290733` (L1) | Date MAX | MAX | 2026-01-10, 2026-05-15, 2026-03-02 | `2026-05-15` | `2026-01-10` | false | MIN | DEVIATES |
| R1 root `13374290733` (L1) | Date MIN | MIN | 2026-01-10, 2026-05-15, 2026-03-02 | `2026-01-10` | `2026-01-10` | false | MIN | PASS |

### Sandbox, API-Version 2026-10

Column metadata. File `captures/31-sandbox-metadata-2026-10.json`. request_id `98df5cc0-3b02-9337-afc6-af25a0186346`, x-request-id `98df5cc0-3b02-9337-afc6-af25a0186346`, sent 2026-10-25T02:43:41.582Z, HTTP 200.

| Column id | Title | Type | `capabilities.calculated.function` | `settings` | `settings_str` |
|---|---|---|---|---|---|
| `timerange_mkyvnykb` | Timeline | timeline | MIN_MAX | `{}` | `{}` |
| `numeric_mm8er9xg` | Num SUM | numbers | SUM | `{}` | `{}` |
| `numeric_mm8esxg1` | Num MIN | numbers | MIN | `{}` | `{}` |
| `numeric_mm8e1qed` | Num MAX | numbers | MAX | `{}` | `{}` |
| `numeric_mm8e1myd` | Num NONE | numbers | NONE | `{}` | `{}` |
| `date_mm8es1zd` | Date MAX | date | MAX | `{}` | `{}` |
| `date_mm8e937y` | Date MIN | date | MIN | `{}` | `{}` |

Ground truth (every item's `parent_item` and values). File `captures/32-sandbox-ground-truth-2026-10.json`. request_id `b2f10f5c-159c-9a36-b90b-b98efe7ba063`, x-request-id `b2f10f5c-159c-9a36-b90b-b98efe7ba063`, sent 2026-10-25T02:43:42.989Z, HTTP 200.

Parents. File `captures/33-sandbox-parents-2026-10.json`. request_id `a680c196-9e91-9007-8b8b-7333f4804efc`, x-request-id `a680c196-9e91-9007-8b8b-7333f4804efc`, sent 2026-10-25T02:43:45.052Z, HTTP 200.

| Parent | Column | Configured function | Leaf values | Expected per docs | Observed | is_leaf | Observed matches | Verdict |
|---|---|---|---|---|---|---|---|---|
| A2x (L4) `13374242116` (L4) | Timeline | MIN_MAX | 2026-05-01..2026-05-20 | `2026-05-01..2026-05-20` | `2026-05-01..2026-05-20` | false | MIN_MAX | PASS |
| A2x (L4) `13374242116` (L4) | Num SUM | SUM | 25 | `25` | `25` | false | SUM, MIN, MAX | PASS |
| A2x (L4) `13374242116` (L4) | Num MIN | MIN | 25 | `25` | `25` | false | SUM, MIN, MAX | PASS |
| A2x (L4) `13374242116` (L4) | Num MAX | MAX | 25 | `25` | `25` | false | SUM, MIN, MAX | PASS |
| A2x (L4) `13374242116` (L4) | Num NONE | NONE | 25 | empty | `25` | false | SUM, MIN, MAX | DEVIATES |
| A2x (L4) `13374242116` (L4) | Date MAX | MAX | 2026-05-15 | `2026-05-15` | `2026-05-15` | false | MIN, MAX | PASS |
| A2x (L4) `13374242116` (L4) | Date MIN | MIN | 2026-05-15 | `2026-05-15` | `2026-05-15` | false | MIN, MAX | PASS |
| A2 (L3) `13374259848` (L3) | Timeline | MIN_MAX | 2026-05-01..2026-05-20 | `2026-05-01..2026-05-20` | `2026-05-01..2026-05-20` | false | MIN_MAX | PASS |
| A2 (L3) `13374259848` (L3) | Num SUM | SUM | 25 | `25` | `25` | false | SUM, MIN, MAX | PASS |
| A2 (L3) `13374259848` (L3) | Num MIN | MIN | 25 | `25` | `25` | false | SUM, MIN, MAX | PASS |
| A2 (L3) `13374259848` (L3) | Num MAX | MAX | 25 | `25` | `25` | false | SUM, MIN, MAX | PASS |
| A2 (L3) `13374259848` (L3) | Num NONE | NONE | 25 | empty | `25` | false | SUM, MIN, MAX | DEVIATES |
| A2 (L3) `13374259848` (L3) | Date MAX | MAX | 2026-05-15 | `2026-05-15` | `2026-05-15` | false | MIN, MAX | PASS |
| A2 (L3) `13374259848` (L3) | Date MIN | MIN | 2026-05-15 | `2026-05-15` | `2026-05-15` | false | MIN, MAX | PASS |
| R3 empty-child root `13374267172` (L1) | Timeline | MIN_MAX | none | empty | empty | false | MIN_MAX, NONE | PASS |
| R3 empty-child root `13374267172` (L1) | Num SUM | SUM | none | empty | empty | false | SUM, MIN, MAX, NONE | PASS |
| R3 empty-child root `13374267172` (L1) | Num MIN | MIN | none | empty | empty | false | SUM, MIN, MAX, NONE | PASS |
| R3 empty-child root `13374267172` (L1) | Num MAX | MAX | none | empty | empty | false | SUM, MIN, MAX, NONE | PASS |
| R3 empty-child root `13374267172` (L1) | Num NONE | NONE | none | empty | empty | false | SUM, MIN, MAX, NONE | PASS |
| R3 empty-child root `13374267172` (L1) | Date MAX | MAX | none | empty | empty | false | MIN, MAX, NONE | PASS |
| R3 empty-child root `13374267172` (L1) | Date MIN | MIN | none | empty | empty | false | MIN, MAX, NONE | PASS |
| A (L2) `13374271723` (L2) | Timeline | MIN_MAX | 2026-05-01..2026-05-20, 2026-03-01..2026-03-10 | `2026-03-01..2026-05-20` | `2026-03-01..2026-05-20` | false | MIN_MAX | PASS |
| A (L2) `13374271723` (L2) | Num SUM | SUM | 25, 11 | `36` | `36` | false | SUM | PASS |
| A (L2) `13374271723` (L2) | Num MIN | MIN | 25, 11 | `11` | `36` | false | SUM | DEVIATES |
| A (L2) `13374271723` (L2) | Num MAX | MAX | 25, 11 | `25` | `36` | false | SUM | DEVIATES |
| A (L2) `13374271723` (L2) | Num NONE | NONE | 25, 11 | empty | `36` | false | SUM | DEVIATES |
| A (L2) `13374271723` (L2) | Date MAX | MAX | 2026-05-15, 2026-03-02 | `2026-05-15` | `2026-03-02` | false | MIN | DEVIATES |
| A (L2) `13374271723` (L2) | Date MIN | MIN | 2026-05-15, 2026-03-02 | `2026-03-02` | `2026-03-02` | false | MIN | PASS |
| R1 root `13374290733` (L1) | Timeline | MIN_MAX | 2026-01-05..2026-01-12, 2026-05-01..2026-05-20, 2026-03-01..2026-03-10 | `2026-01-05..2026-05-20` | `2026-01-05..2026-05-20` | false | MIN_MAX | PASS |
| R1 root `13374290733` (L1) | Num SUM | SUM | 100, 25, 11 | `136` | `136` | false | SUM | PASS |
| R1 root `13374290733` (L1) | Num MIN | MIN | 100, 25, 11 | `11` | `136` | false | SUM | DEVIATES |
| R1 root `13374290733` (L1) | Num MAX | MAX | 100, 25, 11 | `100` | `136` | false | SUM | DEVIATES |
| R1 root `13374290733` (L1) | Num NONE | NONE | 100, 25, 11 | empty | `136` | false | SUM | DEVIATES |
| R1 root `13374290733` (L1) | Date MAX | MAX | 2026-01-10, 2026-05-15, 2026-03-02 | `2026-05-15` | `2026-01-10` | false | MIN | DEVIATES |
| R1 root `13374290733` (L1) | Date MIN | MIN | 2026-01-10, 2026-05-15, 2026-03-02 | `2026-01-10` | `2026-01-10` | false | MIN | PASS |

