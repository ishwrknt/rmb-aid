# SMART Startup Logic — Resume vs. Fresh Start

## Overview

Every pipeline invocation (`smart`, `@smart`, or `/smart`) begins with the same startup check before any agent is
invoked. This ensures that interrupted sessions are always resumed correctly
and fresh sessions always start with a clean slate.

---

## The Startup Check

Inspect state when entering the pipeline (a direct named-agent call does not resume the pipeline):

Inspect the directory and read `PROGRESS.md` if present. Distinguish a missing
file from a read failure. Only a missing tracker permits a fresh start; preserve
empty, unreadable, or unrelated trackers and resolve their state with the user.

---

## Resume Mode

**Trigger:** PROGRESS.md is non-empty, belongs to the current task, and records an approved plan with unfinished work. Do not resume a tracker for an unrelated task.

**Procedure:**

1. Read PROGRESS.md silently (do not print it to the user)
2. Parse the task description from the header
3. Find the first unchecked item: the first line matching `- [ ]`
4. Identify which phase and epic this belongs to
5. Announce to the user:

> "▶ Resuming SMART. You completed [N] files. Next up: [item name].
> Continuing now…"

6. Proceed immediately — no further user input needed
7. Pass all previously-created planning files as context to the current agent

**What counts as completed:** Any item marked `[x]` in PROGRESS.md.

**What counts as next:** The first item marked `[ ]` in document order.

---

## Fresh Start Mode

**Trigger:** PROGRESS.md does not exist.

**Procedure:**

1. Announce to the user: "🆕 Fresh start detected. Beginning SMART pipeline."
2. Invoke Drishti to read the task and scan the working directory. If no task was supplied or established in context, ask what to work on before planning.
3. Continue through Bodhi (knowledge), Tarka (hypothesis), and Yukti (method) to build and display the execution plan
4. Wait for user approval ("yes" or "modify: [change]")
5. On approval: create PROGRESS.md as the very first file, then continue

---

## PROGRESS.md Corruption Recovery

If PROGRESS.md exists but cannot be parsed (malformed markdown):

1. Preserve the existing file and any backups.
2. Report the read or parsing problem.
3. Ask the user how to recover before replacing or renaming the tracker.

---

## Session State Rules

| Rule                             | Behaviour                                        |
| -------------------------------- | ------------------------------------------------ |
| Never re-create a completed file | Skip `[x]` items; go straight to first `[ ]`     |
| Never assume file contents       | Always read files explicitly before using them   |
| Update PROGRESS.md atomically    | Write the full file, not append individual lines |
| Log every decision               | Append to "Decisions Log" section immediately    |

---

## Context Passing on Resume

When resuming, the following documents MUST be passed to the active agent:

- All planning files (00 through 06) that already exist
- All epic docs for the current phase that already exist
- The most recent satya validation report (if any)
- The current smart_metrics.jsonl (last 5 entries minimum)

Without this context, agents may repeat completed work or contradict earlier
decisions.

---

## Example PROGRESS.md Header (Reference)

```markdown
# SMART PROGRESS TRACKER

Task: Build a Kotlin Android physics-tracker app
Started: 2026-05-30T07:07:00Z
Last Updated: 2026-05-30T09:30:00Z
Plan approved: 2026-05-30T07:10:00Z
Approved scope: Core sensor capture and CSV export
```

The `Last Updated` field MUST be refreshed every time PROGRESS.md is written.

---

## References

- Full pipeline: `smart/pipeline.md`
- Agent definitions: `.smart-core/agents/`
- Installable skill: `src/smart-skills/smart-pipeline/SKILL.md`
