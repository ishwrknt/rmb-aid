# 06 — Phases Overview

## Summary

This project is organised into 4 implementation phases after the 8 planning
files. Each phase contains epics. All phases execute in strict order.

---

## Phase 1 — SMART Agentic Coding Pipeline

**Goal:** Package the SMART runtime prompt as an installable rmb-aid skill and
create the core pipeline documentation.

**Why first:** Everything else (agents, case study, metrics) depends on having
the pipeline skill and its canonical documentation in place.

### Epics

| Epic | Name | Key Deliverable |
|---|---|---|
| 01 | smart-pipeline-skill | `src/rmbaid-skills/rmbaid-smart-pipeline/SKILL.md` |
| 02 | pipeline-runtime-docs | `smart/pipeline.md` + `smart/startup.md` |

**Satya method:** structural (planning documents + skill validator)

**Exit criteria:** `npm run validate:skills` passes on new skill.

---

## Phase 2 — Agent Enhancements for Software Dev

**Goal:** Upgrade Satya and Siddhi agent definitions to include software-dev
validation methods and mandatory metrics logging.

**Why second:** The enhanced agents define the behaviour that Phase 3 (case
study) and Phase 4 (metrics module) depend on.

### Epics

| Epic | Name | Key Deliverable |
|---|---|---|
| 01 | satya-software-validation | Updated `.rmbaid-core/agents/satya.md` |
| 02 | siddhi-metrics-logging | Updated `.rmbaid-core/agents/siddhi.md` |
| 03 | templates | `smart-metrics-schema.md` + `epic-tmpl.md` |

**Satya method:** structural (doc completeness + consistency with 04-AGENT-DESIGN)

**Exit criteria:** Both agent files updated; templates created; lint passes.

---

## Phase 3 — Physics Tracker Case Study

**Goal:** Demonstrate SMART applied end-to-end to a real Kotlin/Android
physics-tracking app. Produce all planning-layer documents and populate
smart_metrics.jsonl with 3 real entries.

**Why third:** Provides the concrete proof-of-concept that SMART works on a
real software project. The metrics module (Phase 4) reads from this case study's
JSONL in its tests.

### Epics

| Epic | Name | Key Deliverable |
|---|---|---|
| 01 | case-study-planning-docs | brief + PRD + architecture for physics-tracker |
| 02 | phase-01-overview-and-epics | PHASE-OVERVIEW + 3 epic docs |
| 03 | case-study-metrics | smart_metrics.jsonl with ≥3 valid entries |

**Satya method:** structural (PRD ↔ architecture consistency; JSONL parse check)

**Exit criteria:** AT-04 and AT-05 from 05-VALIDATION-DESIGN.md pass.

---

## Phase 4 — Metrics Logging Module

**Goal:** Ship a production-quality Node.js module that any agent or tool can
use to append validated metric entries to any smart_metrics.jsonl.

**Why fourth:** Depends on the schema defined in Phase 2 and the sample data
from Phase 3 (used in tests).

### Epics

| Epic | Name | Key Deliverable |
|---|---|---|
| 01 | logger-module | `src/smart-metrics/logger.js` + `schema.js` |
| 02 | logger-tests | `test/smart-metrics/logger.test.js` (all passing) |

**Satya method:** unit-tests (AT-03 from 05-VALIDATION-DESIGN.md)

**Exit criteria:** All logger tests pass; `npm run quality` green.

---

## Milestone Map

```
Planning ──────────────────────────────────────── ✅ (this file completes it)
Phase 1 (Pipeline Skill) ──────────────────────── epic-01 → epic-02
Phase 2 (Agent Enhancements) ──────────────────── epic-01 → epic-02 → epic-03
Phase 3 (Physics Tracker Case Study) ──────────── epic-01 → epic-02 → epic-03
Phase 4 (Metrics Module) ──────────────────────── epic-01 → epic-02
Quality Gate ──────────────────────────────────── npm run quality
```

---

## Total Deliverables Count

| Category | Count |
|---|---|
| Planning docs | 8 |
| New source files | 5 |
| New markdown docs | 18 |
| New test files | 1 |
| Total files created | ~32 |
