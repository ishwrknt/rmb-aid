# 01 — Product Requirements Document (PRD)

## Product: SMART Agentic Coding Framework

Version: 1.0.0
Authors: SMART Pipeline (Karma agent)
Based on: rmb-aid v6.2.2 / BMAD-METHOD-main

---

## 1. Problem Statement

Existing SMART agents excel at single-session scientific problem-solving but
lack the infrastructure for multi-phase, multi-file software delivery. There is
no pipeline that:

- Tracks progress across sessions (PROGRESS.md resume)
- Enforces planning-before-coding discipline
- Runs Satya validation after every deliverable
- Records machine-readable metrics for every epic

This PRD specifies the requirements to fill that gap.

---

## 2. Users

| User | Goal |
|---|---|
| Researcher / PhD student | Autonomously build a simulation or analysis tool |
| Android developer | Use SMART to plan and scaffold a new app |
| rmb-aid installer | Install SMART pipeline as a skill via `npx rmb-aid` |
| Agent orchestrator | Invoke SMART pipeline programmatically |

---

## 3. Functional Requirements

### FR-01 — Installable Pipeline Skill

- The SMART agentic pipeline MUST be packaged as a valid rmb-aid skill
- Skill name: `rmbaid-smart-pipeline`
- SKILL.md MUST pass `npm run validate:skills`
- Skill MUST be installable via the existing rmb-aid CLI installer

### FR-02 — PROGRESS.md Resume Logic

- On every invocation, the pipeline MUST check for PROGRESS.md
- If found: read silently, find first unchecked item, announce resume, continue
- If not found: start fresh, create PROGRESS.md as first action

### FR-03 — Mandatory Planning Gate

- 8 planning files MUST be created before any implementation begins
- Order: PROGRESS.md → 00-PROJECT-BRIEF → 01-PRD → 02-CONSTRAINTS →
  03-ARCHITECTURE → 04-AGENT-DESIGN → 05-VALIDATION-DESIGN → 06-PHASES-OVERVIEW
- PROGRESS.md MUST be updated after each file

### FR-04 — Phase / Epic Structure

- Implementation MUST be organised into phases, each with a PHASE-OVERVIEW.md
- Each phase contains 1–N epics
- Each epic MUST have a corresponding `epic-NN-name.md` doc before code is written
- PROGRESS.md is updated after every epic

### FR-05 — Satya Validation Gate

- Satya MUST run after every epic implementation
- Output format: validation report with PASS / PARTIAL / FAIL verdict
- On FAIL: trigger Karma + Yukti retry loop (max 5 retries)
- On FAIL after 5 retries: surface to user with full diagnostic

### FR-06 — Siddhi Metrics Logging

- Siddhi MUST append one entry to smart_metrics.jsonl after every PASS
- Entry MUST conform to the metrics schema (see 05-VALIDATION-DESIGN.md)
- Logging MUST be the final step before marking an epic complete

### FR-07 — Decision Policy

- The pipeline MUST NOT block on minor decisions
- Ambiguity handling: infer → log decision → continue
- Only ask user when task is fundamentally unclear (one question max)

### FR-08 — Physics Tracker Case Study

- A complete SMART planning suite MUST exist under case-studies/physics-tracker/
- Must include: brief, PRD, architecture, phase-01 overview, 3 epics
- A live smart_metrics.jsonl with ≥3 sample entries MUST be present

### FR-09 — Metrics Logging Module

- A Node.js module at src/smart-metrics/ MUST expose:
  - `appendMetric(entry, filepath)` — validates and appends one JSONL line
  - `validateEntry(entry)` — returns { valid, errors }
- Unit tests MUST cover: valid entry, missing required field, type mismatch

---

## 4. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-01 | All new markdown passes `npm run lint:md` |
| NFR-02 | Skill passes `npm run validate:skills --strict` |
| NFR-03 | Node.js module uses zero new runtime dependencies |
| NFR-04 | All files use UTF-8, LF line endings |
| NFR-05 | Conventional Commits for every git commit |
| NFR-06 | `npm run quality` passes on HEAD before any push |

---

## 5. Acceptance Tests

| ID | Test | Expected |
|---|---|---|
| AT-01 | Run `npm run validate:skills` | 0 HIGH findings |
| AT-02 | Run `npm run lint:md` | 0 errors |
| AT-03 | Run `node test/smart-metrics/logger.test.js` | All pass |
| AT-04 | Check case-studies/physics-tracker/ structure | All 9 required files present |
| AT-05 | Count lines in smart_metrics.jsonl | ≥3 valid JSONL entries |
| AT-06 | Parse each JSONL line with JSON.parse() | No parse errors |

---

## 6. Constraints

See `02-CONSTRAINTS-AND-STANDARDS.md`
