# SMART Startup Logic — Resume vs. Fresh Start

## Overview

Every SMART session begins with the same startup check before any agent is
invoked. This ensures that interrupted sessions are always resumed correctly
and fresh sessions always start with a clean slate.

---

## The Startup Check

Execute exactly this command as the first action of every session:

```bash
ls -la && cat PROGRESS.md 2>/dev/null || echo "FRESH START"
```

This command:

1. Lists the working directory so Drishti can identify the platform and context
2. Prints PROGRESS.md if it exists (resume) or prints "FRESH START"

---

## Resume Mode

**Trigger:** PROGRESS.md is found and is non-empty.

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

**Trigger:** PROGRESS.md does not exist, or `cat` returns empty.

**Procedure:**

1. Announce to the user: "🆕 Fresh start detected. Beginning SMART pipeline."
2. Invoke Drishti to read the task and scan the working directory
3. Invoke Bodhi + Tarka to build and display the execution plan
4. Wait for user approval ("yes" or "modify: [change]")
5. On approval: create PROGRESS.md as the very first file, then continue

---

## PROGRESS.md Corruption Recovery

If PROGRESS.md exists but cannot be parsed (malformed markdown):

1. Announce: "⚠️ PROGRESS.md is unreadable. Treating as fresh start."
2. Rename the file: `mv PROGRESS.md PROGRESS.md.bak`
3. Proceed with fresh start mode
4. Log to the new PROGRESS.md: "Recovered from corrupted PROGRESS.md.bak"

---

## Session State Rules

| Rule | Behaviour |
|---|---|
| Never re-create a completed file | Skip `[x]` items; go straight to first `[ ]` |
| Never assume file contents | Always read files explicitly before using them |
| Update PROGRESS.md atomically | Write the full file, not append individual lines |
| Log every decision | Append to "Decisions Log" section immediately |

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
```

The `Last Updated` field MUST be refreshed every time PROGRESS.md is written.

---

## References

- Full pipeline: `smart/pipeline.md`
- Agent definitions: `.rmbaid-core/agents/`
- Installable skill: `src/rmbaid-skills/rmbaid-smart-pipeline/SKILL.md`
