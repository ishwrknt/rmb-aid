# Epic 02 — Statistical Summary

Case Study: PhysicsTracker Android App
Phase: phase-02-visualization
Agent: Karma

## Goal

Implement a post-capture analysis screen that provides key statistics: maximum
and minimum values, average acceleration, total duration, and frequency
analysis (FFT) for periodic motion.

## Requirements Covered

FR-16, FR-17

## Files to Create

| File                             | Purpose                                              |
| -------------------------------- | ---------------------------------------------------- |
| `analysis/StatsEngine.kt`        | Pure Kotlin logic for statistical calculations       |
| `analysis/FftCalculator.kt`      | Computes Fast Fourier Transform for frequency data   |
| `ui/summary/SummaryViewModel.kt` | Orchestrates data loading and calculation triggering |
| `ui/summary/SummaryFragment.kt`  | Displays results in a tabular and visual summary     |

## Implementation Notes

### StatsEngine

- Calculates Mean, Standard Deviation, and Peak-to-Peak values
- Identifies "impact" events based on a threshold (e.g., > 2G)
- Uses `Dispatchers.Default` for all calculations to prevent UI blocking

### FftCalculator

- Transforms time-domain sensor data to frequency-domain
- Used to detect the "shaking" frequency or pendulum period
- Output: List of frequency/amplitude pairs for plotting a histogram

### SummaryViewModel

- Loads data from the `CaptureService` buffer or a saved CSV file
- Persists calculated stats to `SharedPreferences` for "Last Session" recall
- Exposes `StateFlow<AnalysisResult>`

## Hypothesis

I hypothesize that the `FftCalculator` can identify a 2Hz pendulum swing with
±0.1Hz accuracy using a 10s sample at 50Hz. This would be disproven if the
peak frequency reported differs from the ground truth by more than 0.2Hz.

## Satya Validation Method

Structural — verify the 4 files; check mathematical logic in `StatsEngine`;
verify FFT library or manual implementation approach.

## Dependencies

- Phase 01 Epic 01 (Sensor Pipeline)
- Phase 02 Epic 01 (Real-time Graphing)
