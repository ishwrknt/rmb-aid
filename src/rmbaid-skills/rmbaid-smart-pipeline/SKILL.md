---
name: rmbaid-smart-pipeline
description: >-
  Use when you want to autonomously plan, build, validate, and deliver working
  software through the SMART 4-layer agentic pipeline (Drishti → Bodhi → Tarka
  → Karma → Yukti → Satya → Siddhi). Handles fresh starts and mid-session
  resume via PROGRESS.md. Logs all metrics to smart_metrics.jsonl.
---

# SMART Pipeline

Run the full SMART agentic software delivery pipeline on any coding task.
SMART stands for **Simulation Methodology based Agentic Research Tool**.

## What SMART Does

SMART decomposes your plain-language task through 7 specialized agents across
4 layers, produces mandatory planning documents, implements code epic by epic,
validates every deliverable via Satya, and logs metrics via Siddhi — all
automatically.

```
Layer 1 — Perception  : Drishti  → Problem Definition Document
Layer 2 — Planning    : Bodhi    → Phases and high-level goals
                        Tarka    → Sequenced Execution Plan
Layer 3 — Execution   : Karma    → Code / Files
                        Yukti    → Debugged Code (on error)
Layer 4 — Validation  : Satya    → Validation Report (PASS/FAIL)
                        Siddhi   → Final Package + metrics entry
```

## Activation

When the user gives any task, your very first action is:

```bash
ls -la && cat PROGRESS.md 2>/dev/null || echo "FRESH START"
```

**If PROGRESS.md exists** — Resume mode. Read it silently. Find the first
unchecked `[ ]` item. Announce:

> "Resuming SMART. You completed [N] files. Next: [item]. Continuing now…"

**If no PROGRESS.md** — Fresh start. Proceed to Step 1.

## Step 1 — Drishti: Understand the Task

Read the user's plain-language task. Extract:

- What needs to be built (target, deliverable)
- Platform / language (infer from CWD files or task keywords)
- Scientific or technical domain
- Success criteria ("done" looks like what?)

Do NOT ask questions. Infer from task text and `ls -la` output.

## Step 2 — Bodhi + Tarka: Show Plan, Wait for Approval

Generate and display the execution plan. Include:

- One-line task summary
- Inferred platform and domain
- List of 8 planning files (all unchecked)
- Phase list with epic names
- Validation method (what Satya will check)
- Decisions made (any inferences)

End with: **"Approve this plan to begin? (yes / modify: [change])"**

Wait for user response before proceeding.

Approval must be explicit. Silence or an unclear response is not approval.
After approval, proceed automatically within the agreed scope and update progress
after each file. Follow the host tool's permissions and project instructions.
These agents are roles coordinated by the coding assistant; do not claim separate
agents were spawned unless the host actually ran them.

On resume, verify the tracker belongs to the current task and records an approved
plan before continuing. Inspect existing files and validation evidence. If all
items are checked, report completion or plan the user's new task. Preserve an
unreadable tracker and report the problem instead of overwriting it.

## Step 3 — Karma: Create Planning Files (auto, no interruption)

Create all 8 planning files in strict order:

1. `PROGRESS.md`
2. `00-PROJECT-BRIEF.md`
3. `01-PRD.md`
4. `02-CONSTRAINTS-AND-STANDARDS.md`
5. `03-ARCHITECTURE.md`
6. `04-AGENT-DESIGN.md`
7. `05-VALIDATION-DESIGN.md`
8. `06-PHASES-OVERVIEW.md`

After each file: update PROGRESS.md (mark `[x]`), print
`✅ [filename] done. Proceeding to [next]…`

After all 8: print
`📋 All planning complete. Ready to begin implementation. Proceeding to Phase 1…`

Then continue automatically.

## Step 4 — Karma + Yukti: Execute Phase by Phase (auto)

For each phase:

1. Create `phases/phase-NN-name/PHASE-OVERVIEW.md`
2. For each epic:
   - Create `phases/phase-NN-name/epic-NN-name.md` (epic doc first)
   - Implement the epic (write code / files)
   - Run the code, check for errors
   - If error → Yukti fixes (max 5 retries)
   - If still failing after 5 → stop, ask user for guidance
3. After each epic: update PROGRESS.md, print `✅ epic-NN complete`
4. After full phase: print summary, auto-proceed to next phase

## Step 5 — Satya: Validate Every Deliverable (auto)

After each epic implementation, run Satya using this format:

```
SATYA VALIDATION: [epic name]
Method: [analytical / benchmark / cross-validation / unit-tests / structural]
Expected: [known value, behaviour, or structural requirement]
Got: [actual output]
Verdict: PASS / PARTIAL / FAIL
```

- PASS → hand to Siddhi
- FAIL → trigger Karma + Yukti retry loop
- FAIL after 5 retries → report to user with full diagnostic

PARTIAL or unavailable validation does not count as PASS. Use one shared budget
of five retries per epic across execution and validation failures. Record the
command, result, and evidence; never fabricate a successful test.

## Step 6 — Siddhi: Mark Done, Log Metrics (auto)

After Satya passes, Siddhi:

1. Marks epic as `[x]` in PROGRESS.md
2. Appends one entry to `smart_metrics.jsonl`:

```json
{
  "task_id": "phase-NN-epic-NN",
  "timestamp": "ISO8601",
  "agent": "Karma",
  "iterations": 1,
  "auto_errors_caught": 0,
  "satya_result": "PASS",
  "validation_method": "structural",
  "loc_generated": 145,
  "loc_manual": 0,
  "time_seconds": 180
}
```

3. Prints: `✅ [epic] complete. Siddhi confirmed. Metrics logged.`

Record measured values only. If a metric cannot be measured, explain what is
missing and leave the epic pending rather than inventing numbers. Mark completion
only after validation passes and the metrics entry has been written successfully.

## Decision Policy

Never block on minor decisions:

| Situation                  | Action                                      |
| -------------------------- | ------------------------------------------- |
| Language unclear           | Infer from CWD files or task keywords       |
| File structure unclear     | Follow SMART canonical structure (this doc) |
| Validation method unclear  | Default to unit-tests + structural          |
| Two valid approaches       | Pick simpler, log decision in PROGRESS.md   |
| Task fundamentally unclear | Ask ONE concise question, then continue     |

## User Interruptions

The user is interrupted ONLY when:

1. Approving the initial plan (Step 2)
2. Satya validation fails after 5 retries
3. Task is genuinely ambiguous at a fundamental level

Everything else runs automatically.

## Completion

When all phases and epics are done, print a completion summary showing:
task description, total epics completed, total iterations, auto-errors caught,
Satya validations passed, lines of code generated, and path to metrics file.
