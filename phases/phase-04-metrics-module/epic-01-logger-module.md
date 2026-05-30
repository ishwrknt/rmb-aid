# Epic 01 — Logger Module

Phase: Phase 4 — Metrics Logging Module
Agent: Karma
Status: IN PROGRESS

## Goal

Create a pure Node.js utility module that other tools and agents can use to
append metric entries to `smart_metrics.jsonl` safely. It must implement the
schema validation rules defined in `05-VALIDATION-DESIGN.md`.

## Acceptance Criteria

- `src/smart-metrics/logger.js` exports `appendMetric(entry, filepath)`
- `src/smart-metrics/schema.js` exports `validateEntry(entry)`
- `test/smart-metrics/logger.test.js` covers valid entries, missing fields,
  and type mismatches.
- Zero new runtime dependencies (use built-in `fs` and `path`).

## Satya Validation Method

Unit-tests: `node test/smart-metrics/logger.test.js` runs and passes, outputting
confirmation of all test cases.
