# Epic 01 — Real-time Graphing

Case Study: PhysicsTracker Android App
Phase: phase-02-visualization
Agent: Karma

## Goal

Develop a high-performance real-time graphing component to visualize live sensor
data (acceleration or angular velocity) with smooth scrolling and dynamic
auto-scaling.

## Requirements Covered

FR-14, FR-15 (assumed new requirements for visualization)

## Files to Create

| File                          | Purpose                                              |
| ----------------------------- | ---------------------------------------------------- |
| `ui/graph/LivePlotterView.kt` | Custom `SurfaceView` for high-FPS data plotting      |
| `ui/graph/DataBuffer.kt`      | Rolling buffer to hold the last N points for display |
| `ui/graph/GraphViewModel.kt`  | Processes raw sensor data into plotable points       |
| `ui/graph/GraphFragment.kt`   | UI container for the plotter; axis label management  |

## Implementation Notes

### LivePlotterView

- Extends `SurfaceView` to avoid main thread UI overhead during high-rate capture
- Uses a background `Canvas` drawing loop (target 60 FPS)
- Supports pinch-to-zoom on the X-axis (time) and auto-scaling on the Y-axis

### DataBuffer

- Fixed-size ring buffer implementation to prevent memory leaks
- Capacity: 500 samples (covering ~10-50 seconds depending on rate)
- Optimized for fast read access during the draw loop

### GraphViewModel

- Collects from `CaptureService` or `SensorRepository`
- Decimates or averages data points if sample rate > 25Hz to maintain UI fluidity
- Transforms `SensorData` units (e.g., m/s² to G-force toggle)

## Hypothesis

I hypothesize that by using `SurfaceView` for the graphing component, we can maintain 60 FPS plotting even when the sensor sample rate is set to 50 Hz. This will be disproven if the UI thread experiences frame drops > 16ms during active capture and plotting.

## Satya Validation Method

Structural — verify the creation of the 4 files; check that `SurfaceView` is used correctly for the draw loop; ensure `DataBuffer` is a ring buffer.

## Dependencies

- Phase 01 Epic 01 (Sensor Pipeline)
