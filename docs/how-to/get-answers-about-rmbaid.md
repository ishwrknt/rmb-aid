---
title: "How to Get Answers About RMB_AID"
description: Use an LLM to quickly answer your own RMB_AID questions
sidebar:
  order: 4
---

## Start Here: RMB_AID-Help

**The fastest way to get answers about RMB_AID is the `rmbaid-help` skill.** This intelligent guide will answer upwards of 80% of all questions and is available to you directly in your IDE as you work.

RMB_AID-Help is more than a lookup tool — it:
- **Inspects your project** to see what's already been completed
- **Understands natural language** — ask questions in plain English
- **Varies based on your installed modules** — shows relevant options
- **Auto-runs after workflows** — tells you exactly what to do next
- **Recommends the first required task** — no guessing where to start

### How to Use RMB_AID-Help

Call it by name in your AI session:

```
rmbaid-help
```

:::tip
You can also use `/rmbaid-help` or `$rmbaid-help` depending on your platform, but just `rmbaid-help` should work everywhere.
:::

Combine it with a natural language query:

```
rmbaid-help I have a SaaS idea and know all the features. Where do I start?
rmbaid-help What are my options for UX design?
rmbaid-help I'm stuck on the PRD workflow
rmbaid-help Show me what's been done so far
```

RMB_AID-Help responds with:
- What's recommended for your situation
- What the first required task is
- What the rest of the process looks like

## When to Use This Guide

Use this section when:
- You want to understand RMB_AID's architecture or internals
- You need answers outside of what RMB_AID-Help provides
- You're researching RMB_AID before installing
- You want to explore the source code directly

## Steps

### 1. Choose Your Source

| Source               | Best For                                  | Examples                     |
| -------------------- | ----------------------------------------- | ---------------------------- |
| **`_rmbaid` folder**   | How RMB_AID works—agents, workflows, prompts | "What does the PM agent do?" |
| **Full GitHub repo** | History, installer, architecture          | "What changed in v6?"        |
| **`llms-full.txt`**  | Quick overview from docs                  | "Explain RMB_AID's four phases" |

The `_rmbaid` folder is created when you install RMB_AID. If you don't have it yet, clone the repo instead.

### 2. Point Your AI at the Source

**If your AI can read files (Claude Code, Cursor, etc.):**

- **RMB_AID installed:** Point at the `_rmbaid` folder and ask directly
- **Want deeper context:** Clone the [full repo](https://github.com/rmbaid-code-org/RMB_AID)

**If you use ChatGPT or Claude.ai:**

Fetch `llms-full.txt` into your session:

```text
https://rmbaid-code-org.github.io/RMB_AID/llms-full.txt
```


### 3. Ask Your Question

:::note[Example]
**Q:** "Tell me the fastest way to build something with RMB_AID"

**A:** Use Quick Flow: Run `rmbaid-quick-dev` — it clarifies your intent, plans, implements, reviews, and presents results in a single workflow, skipping the full planning phases.
:::

## What You Get

Direct answers about RMB_AID—how agents work, what workflows do, why things are structured the way they are—without waiting for someone else to respond.

## Tips

- **Verify surprising answers** — LLMs occasionally get things wrong. Check the source file or ask on Discord.
- **Be specific** — "What does step 3 of the PRD workflow do?" beats "How does PRD work?"

## Still Stuck?

Tried the LLM approach and still need help? You now have a much better question to ask.

| Channel                   | Use For                                     |
| ------------------------- | ------------------------------------------- |
| `#rmb-aid-help`       | Quick questions (real-time chat)            |
| `help-requests` forum     | Detailed questions (searchable, persistent) |
| `#suggestions-feedback`   | Ideas and feature requests                  |
| `#report-bugs-and-issues` | Bug reports                                 |

**Discord:** [discord.gg/gk8jAdXWmj](https://discord.gg/gk8jAdXWmj)

**GitHub Issues:** [github.com/rmbaid-code-org/RMB_AID/issues](https://github.com/rmbaid-code-org/RMB_AID/issues) (for clear bugs)

*You!*
        *Stuck*
             *in the queue—*
                      *waiting*
                              *for who?*

*The source*
        *is there,*
                *plain to see!*

*Point*
     *your machine.*
              *Set it free.*

*It reads.*
        *It speaks.*
                *Ask away—*

*Why wait*
        *for tomorrow*
                *when you have*
                        *today?*

*—Claude*
