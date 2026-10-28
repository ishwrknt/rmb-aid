# SMART Pipeline — Canonical Runtime Reference

Version: 1.0.0
Framework: SMART (Simulation Methodology based Agentic Research Tool)
Built on: smart-agentic v6.2.2 / BMAD-METHOD

---

## Purpose

This document explains the SMART agentic coding pipeline. The installable skill
in `src/smart-skills/smart-pipeline/SKILL.md` is the executable prompt
and source of truth. Run `smart prompt` to print that exact prompt for any coding
assistant. This reference is maintained manually, not generated.

---

## Calling SMART Agents

Call `@drishti`, `@bodhi`, `@tarka` (or `@tarak`), `@yukti`, `@karma`,
`@satya`, or `@siddhi` to work directly with that agent. Names are
case-insensitive; bare names and slash forms also work. The agent responds in
its own name and stays active until you switch. A direct call does not start
the full pipeline.

Call `smart`, `@smart`, or `/smart` with your task to coordinate the team:
Drishti → Bodhi → Tarka → Yukti → Karma → Satya → Siddhi. Each role receives
the previous role’s result and continues automatically. The initial plan
still requires approval; subsequent handoffs proceed within the approved
scope. A bare `smart` uses the current task or a matching approved unfinished
session, and asks for a task if neither exists.

## The 4-Layer Architecture

```
Layer 1 — PERCEPTION
  Agent: Drishti
  Input: Plain-language task from user
  Output: Problem Definition Document (PDD)

Layer 2 — PLANNING
  Agent: Bodhi   → Knowledge Map
  Agent: Tarka   → Method Hypothesis
  Agent: Yukti   → Method and Sequenced Execution Plan (phases + epics)

Layer 3 — EXECUTION
  Agent: Karma   → Code and files (per epic)
  Agent: Yukti   → Debugged code (on error, max 5 retries)

Layer 4 — VALIDATION
  Agent: Satya   → Validation Report (PASS / PARTIAL / FAIL)
  Agent: Siddhi  → Final package + smart_metrics.jsonl entry
```

---

## Mandatory File Order

### Planning Gate (must complete before any implementation)

1. `PROGRESS.md` — session state, updated after every file
2. `00-PROJECT-BRIEF.md` — problem, background, success criteria
3. `01-PRD.md` — functional and non-functional requirements
4. `02-CONSTRAINTS-AND-STANDARDS.md` — hard limits and quality rules
5. `03-ARCHITECTURE.md` — system layout, data flow, decisions
6. `04-AGENT-DESIGN.md` — per-agent inputs, outputs, handoffs
7. `05-VALIDATION-DESIGN.md` — Satya methods, JSONL schema, acceptance tests
8. `06-PHASES-OVERVIEW.md` — all phases, epics, exit criteria

### Implementation Gate (per phase)

For each phase `phase-NN-name`:

```
phases/
  phase-NN-name/
    PHASE-OVERVIEW.md          ← created first
    epic-01-name.md            ← epic doc created before code
    epic-02-name.md
    ...
```

### Implementation Gate (per epic)

For each epic, Karma must:

1. Create the epic `.md` document first
2. Write code / files
3. Run and confirm no errors (hand to Yukti if errors)
4. Wait for Satya verdict
5. Wait for Siddhi metrics log

Only then mark `[x]` in PROGRESS.md.

---

## Agent Handoff Phrases

These are the canonical signals the orchestrator uses to know which agent
to invoke next:

| Agent        | Completion signal                                            |
| ------------ | ------------------------------------------------------------ |
| Drishti      | "Drishti complete. Problem framed. Passing to Bodhi."        |
| Bodhi        | "Bodhi complete. Knowledge mapped. Passing to Tarka."        |
| Tarka        | "Tarka complete. Hypothesis formed. Passing to Yukti."       |
| Karma        | "Karma complete. Implementation done. Passing to Satya."     |
| Yukti        | "Yukti complete. Method planned. Passing to Karma."          |
| Satya (PASS) | "Satya complete. Validation PASSED. Passing to Siddhi."      |
| Satya (FAIL) | "Satya complete. Validation FAILED. Returning to [agent]."   |
| Siddhi       | "Siddhi complete. SMART solution delivered. Metrics logged." |

---

## Retry Protocol

```
Karma implements epic
        │
        ▼
      run code
        │
   ─────┼──────────────────────
   OK   │   ERROR
        │     │
        │     ▼
        │   Yukti diagnoses + fixes
        │     │
        │   re-run (retry N)
        │     │
        │   N > 5 → escalate to user
        ▼
   Satya validates
        │
   PASS ┼ FAIL (retry Karma/Yukti)
        │
   Siddhi logs
        │
   PROGRESS.md [x]
```

---

## Satya Validation Method Priority

1. Analytical — closed-form comparison
2. Benchmark — published reference
3. Cross-validation — compare to alternative implementation
4. Unit tests — automated test suite
5. Structural — document completeness (for planning-only epics)

---

## smart_metrics.jsonl Entry (required fields)

```json
{
  "task_id": "phase-NN-epic-NN",
  "timestamp": "ISO8601-UTC",
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

Full schema: see `05-VALIDATION-DESIGN.md` and `src/smart-metrics/schema.js`.

---

## PROGRESS.md Format

```markdown
# SMART PROGRESS TRACKER

Task: [original task]
Started: [ISO8601]
Last Updated: [ISO8601]

## Planning Files

- [x] PROGRESS.md
- [x] 00-PROJECT-BRIEF.md
      ...

## Phase 1: [name]

- [ ] PHASE-OVERVIEW.md
- [ ] epic-01-[name].md ← NEXT
      ...

## Decisions Log

- [datetime]: [decision and rationale]

## Notes

[important cross-session context]
```

---

## References

- Agent definitions: `.smart-core/agents/`
- Installable skill: `src/smart-skills/smart-pipeline/SKILL.md`
- Metrics schema: `src/smart-metrics/schema.js`
- Startup logic: `smart/startup.md`
- Case study: `case-studies/physics-tracker/`
