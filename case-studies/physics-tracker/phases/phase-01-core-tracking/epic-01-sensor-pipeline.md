# Epic 01 — Sensor Pipeline

Case Study: PhysicsTracker Android App
Phase: phase-01-core-tracking
Agent: Karma

## Goal

Build the real-time sensor capture pipeline: dual sensor registration
(accelerometer + gyroscope), a timestamped data model, foreground service for
background capture, and a configurable sample-rate mechanism.

## Requirements Covered

FR-01, FR-02, FR-03, FR-04, FR-05

## Files to Create

| File                               | Purpose                                              |
| ---------------------------------- | ---------------------------------------------------- |
| `sensor/SensorData.kt`             | Immutable data class — one reading per sensor event  |
| `sensor/SensorRepository.kt`       | `SensorManager` wrapper; emits `Flow<SensorData>`    |
| `sensor/CaptureService.kt`         | `ForegroundService`; collects flow; buffers readings |
| `ui/tracking/TrackingViewModel.kt` | Exposes `StateFlow<List<SensorData>>` to UI          |
| `ui/tracking/TrackingFragment.kt`  | Start/stop controls; sample-rate dropdown            |

## Implementation Notes

### SensorData

```kotlin
data class SensorData(
    val timestampMs: Long,   // SensorEvent.timestamp ns → ms
    val ax: Float, val ay: Float, val az: Float,  // accelerometer m/s²
    val gx: Float, val gy: Float, val gz: Float   // gyroscope rad/s
)
```

### SensorRepository

- Registers both sensors with `SENSOR_DELAY_GAME` as base
- Applies software throttle to enforce 10 / 25 / 50 Hz target rates
- Uses `callbackFlow` to bridge callback to coroutine flow

### CaptureService

- Started as `ForegroundService` with `FOREGROUND_SERVICE_TYPE_SPECIAL_USE`
- Collects from `SensorRepository.dataFlow` on `Dispatchers.Default`
- Holds readings in `ConcurrentLinkedQueue<SensorData>` (max 300 000 entries)
- Exposes `fun getAndClearBuffer(): List<SensorData>` for export

### Sample Rate

- UI spinner: 10 Hz / 25 Hz / 50 Hz
- Stored in `SharedPreferences` key `"pref_sample_rate_hz"`
- `SensorRepository` reads on start; no live switching during capture

## Hypothesis

I hypothesize that a `callbackFlow` throttled at the SensorRepository layer
will deliver ≥ 2 900 readings per 60 s at 50 Hz. This would be disproven if
any 1 s window contains fewer than 40 readings.

## Satya Validation Method

Structural — verify all 5 files listed, FR-01 through FR-05 addressed,
SensorData fields match CSV columns in FR-06.

## Dependencies

None — this is the first epic.
