# Phase 01 — Core Tracking Features

Case Study: PhysicsTracker Android App
SMART Phase: 1 of 1

## Goal

Implement the three foundational features of PhysicsTracker:
sensor pipeline, data export, and light analysis.

## Epics

| Epic | Name            | Key Module                            | Status  |
| ---- | --------------- | ------------------------------------- | ------- |
| 01   | sensor-pipeline | `SensorRepository` + `CaptureService` | planned |
| 02   | data-export     | `CsvExporter` + `FileNamer`           | planned |
| 03   | light-analysis  | `LuxAnalyzer` + `LuxOverlayView`      | planned |

## Entry Criteria

- `00-PROJECT-BRIEF.md` complete ✅
- `01-PRD.md` complete ✅
- `03-ARCHITECTURE.md` complete ✅

## Exit Criteria

- All 3 epics pass Satya validation
- All 13 functional requirements (FR-01 to FR-13) have corresponding
  implementation in at least one epic
- `smart_metrics.jsonl` contains 3 entries, one per epic

## Satya Method for This Phase

All epics use `structural` (planning-layer docs, no runnable Android code).
Cross-validation against the architecture FR coverage table.
