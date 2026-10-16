# 03 — Architecture

## System Overview

SMART Agentic Coding Framework is a 4-layer, 7-agent pipeline that runs entirely
inside a coding AI assistant (Antigravity / Claude / Codex / Cursor). It produces
planning documents, code, validation reports, and metrics as file-system artifacts.

```
┌─────────────────────────────────────────────────────────┐
│                  SMART PIPELINE                         │
├──────────────┬──────────────────────────────────────────┤
│ LAYER 1      │ Perception                               │
│ Agent: Drishti│ Task → Problem Definition Document      │
├──────────────┼──────────────────────────────────────────┤
│ LAYER 2      │ Planning                                 │
│ Bodhi        │ PDD → Knowledge Map                      │
│ Tarka        │ Knowledge Map → Sequenced Execution Plan │
├──────────────┼──────────────────────────────────────────┤
│ LAYER 3      │ Execution                                │
│ Karma        │ Plan → Working Code / Files              │
│ Yukti        │ Error → Debugged Code (retry loop)       │
├──────────────┼──────────────────────────────────────────┤
│ LAYER 4      │ Validation                               │
│ Satya        │ Output → Validation Report (PASS/FAIL)   │
│ Siddhi       │ PASS → Final Package + Metrics Entry     │
└──────────────┴──────────────────────────────────────────┘
```

---

## File System Layout

```
BMAD-METHOD-main/
├── PROGRESS.md                         ← session state (resume anchor)
├── 00-PROJECT-BRIEF.md                 ← planning layer
├── 01-PRD.md
├── 02-CONSTRAINTS-AND-STANDARDS.md
├── 03-ARCHITECTURE.md
├── 04-AGENT-DESIGN.md
├── 05-VALIDATION-DESIGN.md
├── 06-PHASES-OVERVIEW.md
│
├── smart/                              ← pipeline runtime docs
│   ├── pipeline.md                     ← SMART runtime prompt (canonical)
│   └── startup.md                      ← resume / fresh-start logic
│
├── src/
│   ├── rmbaid-skills/
│   │   └── rmbaid-smart-pipeline/      ← NEW installable skill
│   │       └── SKILL.md
│   └── smart-metrics/                  ← NEW Node.js logging module
│       ├── logger.js
│       └── schema.js
│
├── .rmbaid-core/
│   ├── agents/
│   │   ├── satya.md                    ← ENHANCED: software-dev validation
│   │   └── siddhi.md                   ← ENHANCED: metrics logging
│   ├── templates/
│   │   ├── smart-metrics-schema.md     ← NEW: JSONL entry spec
│   │   └── epic-tmpl.md               ← NEW: epic document template
│   └── workflows/
│       └── new-solution-fullstack.md   ← existing (unchanged)
│
├── case-studies/
│   └── physics-tracker/
│       ├── 00-PROJECT-BRIEF.md
│       ├── 01-PRD.md
│       ├── 03-ARCHITECTURE.md
│       ├── smart_metrics.jsonl         ← live metrics for this case study
│       └── phases/
│           └── phase-01-core-tracking/
│               ├── PHASE-OVERVIEW.md
│               ├── epic-01-sensor-pipeline.md
│               ├── epic-02-data-export.md
│               └── epic-03-light-analysis.md
│
└── test/
    └── smart-metrics/
        └── logger.test.js
```

---

## Agent Data Flow

```
User Task (plain language)
        │
        ▼
  ┌──────────┐
  │ Drishti  │── produces ──▶ Problem Definition Document (PDD)
  └──────────┘
        │
        ▼
  ┌──────────┐
  │  Bodhi   │── produces ──▶ Knowledge Map
  └──────────┘
        │
        ▼
  ┌──────────┐
  │  Tarka   │── produces ──▶ Sequenced Execution Plan
  └──────────┘
        │
        ▼
  ┌──────────┐    ┌──────────┐
  │  Karma   │◀──▶│  Yukti   │  (retry loop, max 5)
  └──────────┘    └──────────┘
        │
        ▼
  ┌──────────┐
  │  Satya   │── PASS ──▶ Siddhi
  │          │── FAIL ──▶ Karma/Yukti (retry)
  └──────────┘── FAIL×5 ─▶ User
        │
        ▼
  ┌──────────┐
  │  Siddhi  │── writes ──▶ smart_metrics.jsonl
  │          │── marks ───▶ PROGRESS.md ✅
  └──────────┘── delivers ▶ Final Package
```

---

## PROGRESS.md State Machine

```
                ┌─────────────┐
  session start │             │
────────────────▶  check for  │
                │ PROGRESS.md │
                └──────┬──────┘
                       │
          ┌────────────┴────────────┐
      exists                    not found
          │                         │
          ▼                         ▼
   Resume Mode                Fresh Start
   Read silently              Create PROGRESS.md
   Find first [ ]             Start pipeline step 1
   Announce: "Resuming…"
          │
          ▼
   Continue from
   first unchecked item
```

---

## Metrics JSONL Schema (summary)

Full schema in `05-VALIDATION-DESIGN.md`. Shape:

```json
{
  "task_id": "phase-01-epic-01",
  "timestamp": "2026-05-30T07:07:00Z",
  "agent": "Karma",
  "iterations": 1,
  "auto_errors_caught": 0,
  "satya_result": "PASS",
  "validation_method": "unit-tests",
  "loc_generated": 120,
  "loc_manual": 0,
  "time_seconds": 180
}
```

---

## Key Architectural Decisions

| Decision                        | Rationale                                           |
| ------------------------------- | --------------------------------------------------- |
| Skill-based packaging           | Reuses rmb-aid installer; no new CLI tooling needed |
| File-system state (PROGRESS.md) | Survives session resets; readable by any agent      |
| JSONL not JSON                  | Append-only, no parse-the-whole-file on each write  |
| CommonJS for logger             | Consistent with existing tools/ (all CJS)           |
| Planning files in repo root     | Visible to all agents; easy to reference            |
| Case studies in case-studies/   | Isolated from framework; easily extensible          |
