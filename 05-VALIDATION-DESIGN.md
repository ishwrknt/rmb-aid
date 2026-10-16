# 05 — Validation Design

## Purpose

This document defines:

1. The Satya validation gate logic (when and how each method is applied)
2. The smart_metrics.jsonl schema (every field, type, and constraint)
3. Acceptance tests for the framework itself

---

## 1. Satya Validation Gate

### When Satya Runs

Satya runs exactly once per epic, after Karma + Yukti confirm the implementation
is error-free (code runs without exceptions).

### Method Selection (in priority order)

Satya MUST select the highest-applicable method from this list:

| Priority | Method           | Applicable when                              |
| -------- | ---------------- | -------------------------------------------- |
| 1        | Analytical       | Output has a known closed-form solution      |
| 2        | Benchmark        | A published reference result exists          |
| 3        | Cross-validation | An alternative working implementation exists |
| 4        | Unit tests       | Automated tests can be written and run       |
| 5        | Structural       | Epic is planning/documentation only          |

### Structural Validation Checklist (Method 5)

Used for all planning epics (PROJECT-BRIEF, PRD, ARCHITECTURE etc.):

- [ ] Document has a title (H1 heading)
- [ ] All sections referenced in the Table of Contents exist
- [ ] All cross-references to other planning files resolve
- [ ] PRD functional requirements are numbered (FR-NN format)
- [ ] Architecture file layout matches actual created files
- [ ] No section is empty (placeholder text is not acceptable)
- [ ] Decisions made are logged in PROGRESS.md

### Verdict Definitions

| Verdict | Meaning                       | Action                       |
| ------- | ----------------------------- | ---------------------------- |
| PASS    | All method criteria met       | Hand to Siddhi               |
| PARTIAL | Core criteria met; minor gaps | Karma minor fix; re-validate |
| FAIL    | Core criteria not met         | Yukti/Karma retry (max 5)    |

---

## 2. smart_metrics.jsonl Schema

Each line in `smart_metrics.jsonl` is a single valid JSON object.

### Required Fields

| Field                | Type    | Constraint                | Description                           |
| -------------------- | ------- | ------------------------- | ------------------------------------- |
| `task_id`            | string  | `phase-NN-epic-NN` format | Unique identifier for this epic       |
| `timestamp`          | string  | ISO 8601 UTC              | When Siddhi logged this entry         |
| `agent`              | string  | One of: Karma, Yukti      | Primary executing agent               |
| `iterations`         | integer | ≥ 1                       | Number of Karma+Yukti loops taken     |
| `auto_errors_caught` | integer | ≥ 0                       | Errors caught and fixed automatically |
| `satya_result`       | string  | PASS, PARTIAL, or FAIL    | Satya's final verdict                 |
| `validation_method`  | string  | See method list above     | Method Satya applied                  |
| `loc_generated`      | integer | ≥ 0                       | Lines of code / content generated     |
| `loc_manual`         | integer | ≥ 0                       | Lines added by human after generation |
| `time_seconds`       | integer | ≥ 0                       | Wall-clock seconds for the epic       |

### Optional Fields

| Field        | Type   | Description                                 |
| ------------ | ------ | ------------------------------------------- |
| `notes`      | string | Any Yukti diagnostic or decision note       |
| `case_study` | string | Identifier for the case study if applicable |
| `phase`      | string | Human-readable phase name                   |
| `epic_name`  | string | Human-readable epic name                    |

### Sample Valid Entry

```json
{
  "task_id": "phase-01-epic-01",
  "timestamp": "2026-05-30T07:10:00Z",
  "agent": "Karma",
  "iterations": 1,
  "auto_errors_caught": 0,
  "satya_result": "PASS",
  "validation_method": "structural",
  "loc_generated": 145,
  "loc_manual": 0,
  "time_seconds": 180,
  "case_study": "physics-tracker",
  "phase": "phase-01-core-tracking",
  "epic_name": "sensor-pipeline"
}
```

### Schema Validation Rules (enforced by src/smart-metrics/schema.js)

1. All 10 required fields must be present
2. `task_id` must match regex `/^phase-\d{2}-epic-\d{2}$/`
3. `timestamp` must be parseable by `new Date()`
4. `agent` must be `"Karma"` or `"Yukti"`
5. `iterations`, `auto_errors_caught`, `loc_generated`, `loc_manual`,
   `time_seconds` must all be non-negative integers
6. `satya_result` must be `"PASS"`, `"PARTIAL"`, or `"FAIL"`
7. `validation_method` must be one of: `"analytical"`, `"benchmark"`,
   `"cross-validation"`, `"unit-tests"`, `"structural"`

---

## 3. Framework Acceptance Tests

### AT-01 — Skill Validation

```bash
npm run validate:skills
```

Expected: 0 HIGH findings. The new `rmbaid-smart-pipeline` skill must pass
all 14 deterministic rules.

### AT-02 — Markdown Lint

```bash
npm run lint:md
```

Expected: 0 errors across all new markdown files.

### AT-03 — Metrics Logger Tests

```bash
node test/smart-metrics/logger.test.js
```

Expected: PASS on all test cases:

- Valid entry → appended to file, no error
- Missing required field → `validateEntry` returns `{ valid: false, errors: [...] }`
- Wrong type for integer field → validation error
- File does not exist → created automatically, entry written

### AT-04 — Case Study Completeness

Structural check (manual):

- [ ] `case-studies/physics-tracker/00-PROJECT-BRIEF.md` exists
- [ ] `case-studies/physics-tracker/01-PRD.md` exists
- [ ] `case-studies/physics-tracker/03-ARCHITECTURE.md` exists
- [ ] `case-studies/physics-tracker/phases/phase-01-core-tracking/PHASE-OVERVIEW.md` exists
- [ ] `case-studies/physics-tracker/phases/phase-01-core-tracking/epic-01-sensor-pipeline.md` exists
- [ ] `case-studies/physics-tracker/phases/phase-01-core-tracking/epic-02-data-export.md` exists
- [ ] `case-studies/physics-tracker/phases/phase-01-core-tracking/epic-03-light-analysis.md` exists
- [ ] `case-studies/physics-tracker/smart_metrics.jsonl` exists

### AT-05 — JSONL Integrity

```bash
node -e "
const fs = require('fs');
const lines = fs.readFileSync(
  'case-studies/physics-tracker/smart_metrics.jsonl', 'utf8'
).trim().split('\n');
lines.forEach((l, i) => JSON.parse(l));
console.log('All ' + lines.length + ' entries valid');
"
```

Expected: `All N entries valid` with N ≥ 3.

### AT-06 — Full Quality Gate

```bash
npm ci && npm run quality
```

Expected: all checks pass (format, lint, lint:md, docs:build,
test:install, test:refs, test:rehype, validate:refs, validate:skills).

---

## 4. Satya Report Template

```
SATYA VALIDATION REPORT
═══════════════════════
Epic: [task_id]
Method: [validation_method]
────────────────────────────────
Expected: [known correct value, behaviour, or structural requirement]
Got:      [actual output or document state]
────────────────────────────────
Verdict:          [PASS / PARTIAL / FAIL]
Confidence:       [HIGH / MEDIUM / LOW]
Auto errors caught: [N]
Recommended action: [proceed to Siddhi / retry Karma / escalate]
```
