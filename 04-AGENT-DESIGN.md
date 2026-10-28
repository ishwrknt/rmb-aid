# 04 — Agent Design

## Overview

The SMART Agentic Coding Framework uses 7 agents across 4 layers. Each agent
has a defined identity, input, output, and handoff protocol. This document
specifies the agentic coding adaptations layered on top of the base SMART
research agents already defined in `.smart-core/agents/`.

---

## Agent Roster

| Layer      | Agent   | Role              | Input                      | Output                  |
| ---------- | ------- | ----------------- | -------------------------- | ----------------------- |
| Perception | Drishti | Problem Analyst   | User task (plain language) | Problem Definition Doc  |
| Planning   | Bodhi   | Knowledge Mapper  | PDD                        | Knowledge Map           |
| Planning   | Tarka   | Sequencer         | Knowledge Map              | Execution Plan          |
| Execution  | Karma   | Builder           | Plan + epic doc            | Code / files            |
| Execution  | Yukti   | Debugger          | Error + context            | Fixed code              |
| Validation | Satya   | Validator         | Implementation + criteria  | Validation Report       |
| Validation | Siddhi  | Packager + Logger | Validation Report          | Package + metrics entry |

---

## Agent Definitions

### Drishti (Perception)

**Philosophy:** Clarity of vision precedes clarity of solution.

**Agentic Coding Adaptations:**

In the research mode, Drishti produces a Problem Definition Document for a
scientific question. In agentic coding mode, Drishti additionally:

- Scans the working directory (`ls -la`) before forming conclusions
- Reads `PROGRESS.md` if present (resume) or announces fresh start
- Identifies: target language/platform, scientific domain, existing codebase
- Outputs a structured task brief that Bodhi can decompose

**Trigger:** Every session start, every resume.

**Output:** Problem Definition Document (or resume announcement + PROGRESS.md read).

**Handoff:** "Drishti complete. Passing to Bodhi."

---

### Bodhi (Planning — Knowledge Mapping)

**Philosophy:** Map the known before charting the unknown.

**Agentic Coding Adaptations:**

- Identifies existing code, libraries, and patterns in the CWD
- Maps required knowledge domains (e.g. Android Sensor API, Kotlin coroutines)
- Notes what the team already knows vs. what needs to be learned/researched

**Output:** Knowledge Map (domain expertise, existing assets, gaps).

**Handoff:** "Bodhi complete. Passing to Tarka."

---

### Tarka (Planning — Sequencing)

**Philosophy:** Sequence is not optional; it is the plan.

**Agentic Coding Adaptations:**

- Decomposes the Knowledge Map into phases and epics
- Resolves inter-epic dependencies (A must precede B)
- Produces the canonical execution plan shown in Step 2 of the pipeline
- Creates the epic list that populates PROGRESS.md

**Output:** Sequenced Execution Plan (phases → epics → order).

**Handoff:** "Tarka complete. Passing to Karma."

---

### Karma (Execution — Builder)

**Philosophy:** Right action, done completely, no shortcuts and no guesswork.

**Agentic Coding Adaptations:**

For each epic, Karma:

1. Creates the epic doc (`epic-NN-name.md`) before writing any code
2. Writes code in strict order: skeleton → implementation → tests
3. Runs the code and checks for errors
4. If errors → hands to Yukti
5. Updates PROGRESS.md after each file created

**Output per epic:** Epic doc + implementation files + run confirmation.

**Handoff:** "Karma complete. Passing to Yukti for error check." (or Satya if clean)

---

### Yukti (Execution — Debugger)

**Philosophy:** Bugs are information, not failures.

**Agentic Coding Adaptations:**

- Receives a failing run + error log from Karma
- Diagnoses root cause using model-based reasoning (not trial and error)
- Applies targeted fix
- Hands back to Karma to re-run
- Maximum 5 retry cycles; after 5, surfaces to user with full diagnostic

**Output:** Fixed code + root-cause explanation.

**Handoff:** "Yukti complete. Returning to Karma for re-run." (or user escalation)

---

### Satya (Validation) — ENHANCED FOR SOFTWARE DEV

**Philosophy:** Truth cannot be claimed, it must be demonstrated.

**Base behaviour:** inherited from `.smart-core/agents/satya.md`

**Software-Development Enhancements:**

Satya selects one or more validation methods from this ordered priority list:

1. **Analytical** — compare numerical output against closed-form solution
2. **Benchmark** — compare against published benchmark result
3. **Cross-validation** — compare against existing working version
   (e.g. validate Android app behaviour against a PC reference implementation)
4. **Unit tests** — run automated tests, verify all pass
5. **Structural** — for planning-only epics, verify document completeness and
   internal consistency (PRD goals covered by architecture, no dangling refs)

**Validation Report Format:**

```
SATYA VALIDATION: [epic name]
Method: [selected method from list above]
Expected: [known correct value, behaviour, or structural requirement]
Got: [actual output or document state]
Verdict: PASS / PARTIAL / FAIL
Confidence: HIGH / MEDIUM / LOW
Recommended action: [proceed / retry Karma / retry Yukti / escalate]
```

**Routing:**

- PASS → Siddhi
- PARTIAL → Karma with specific fix instructions
- FAIL → Yukti (if code error) or Karma (if logic/doc error)
- FAIL × 5 → user escalation with full diagnostic

**Handoff:** "Satya complete. Validation [PASSED/FAILED]. Passing to Siddhi."

---

### Siddhi (Validation — Packager + Logger) — ENHANCED FOR METRICS

**Philosophy:** A solution that cannot be used, and cannot be measured, is not
a solution.

**Base behaviour:** inherited from `.smart-core/agents/siddhi.md`

**Software-Development Enhancements:**

After Satya passes, Siddhi performs these steps in strict order:

1. Code cleanup (remove debug artifacts, apply consistent formatting)
2. Update README or module-level documentation
3. Append one entry to `smart_metrics.jsonl` using the schema in
   `05-VALIDATION-DESIGN.md`
4. Mark the epic as ✅ in PROGRESS.md
5. Print completion summary

**Metrics logging is mandatory — an epic is NOT complete until the JSONL
entry is written.**

**Output:** Cleaned deliverable + updated PROGRESS.md + new JSONL line.

**Handoff:** "Siddhi complete. SMART solution delivered. Metrics logged."

---

## Inter-Agent Communication Protocol

Agents communicate by producing markdown files. No agent invents information
that should have come from a prior agent — all upstream documents are passed in
context. The handoff phrases above are the canonical signals used by the
orchestrator to know which agent to invoke next.

---

## Failure Escalation Matrix

| Failure               | First route    | Second route      | User escalation     |
| --------------------- | -------------- | ----------------- | ------------------- |
| Code error (runtime)  | Yukti          | Karma re-run      | After 5 retries     |
| Satya FAIL (logic)    | Karma rework   | Tarka re-plan     | After 5 retries     |
| Satya FAIL (science)  | Bodhi re-map   | Tarka re-sequence | After 5 retries     |
| Ambiguous requirement | Infer + log    | —                 | Only if fundamental |
| Missing dependency    | Infer platform | Install + log     | Only if unavailable |
