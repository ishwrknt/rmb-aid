# Phase 02 — Agent Enhancements for Software Dev

## Goal

Upgrade Satya and Siddhi for software-development contexts and create
reusable templates for all future SMART epics and metrics entries.

## Epics

| Epic | Deliverable                                | Status |
| ---- | ------------------------------------------ | ------ |
| 01   | `.smart-core/agents/satya.md` enhanced     | ✅     |
| 02   | `.smart-core/agents/siddhi.md` enhanced    | ✅     |
| 03   | `smart-metrics-schema.md` + `epic-tmpl.md` | ✅     |

## Satya Result: PASS

All 4 files passed `npm run lint:md` with 0 errors. Agent definitions are
internally consistent with `04-AGENT-DESIGN.md` and `05-VALIDATION-DESIGN.md`.

## Key Changes

- Satya: added 5-tier validation method priority, structured report format,
  routing table (PASS/PARTIAL/FAIL), structural checklist, and 5-retry cap
- Siddhi: added mandatory 5-step post-PASS protocol with metrics logging as
  non-skippable step 3
- Templates: canonical JSONL schema reference + standardised epic doc template

## Metrics

See `smart_metrics.jsonl` entries `phase-02-epic-01` through `phase-02-epic-03`.
