# Epic 03 — Light Analysis

Case Study: PhysicsTracker Android App
Phase: phase-01-core-tracking
Agent: Karma

## Goal

Implement the camera-based light intensity measurement workflow: per-frame lux
computation via CameraX `ImageAnalysis`, a canvas-drawn real-time overlay graph
on the camera preview, landscape layout with the graph pinned to the right panel,
and CSV export of the lux time series.

## Requirements Covered

FR-10, FR-11, FR-12, FR-13

## Files to Create

| File | Purpose |
|---|---|
| `light/LuxData.kt` | Data class — one measurement per frame |
| `light/LuxAnalyzer.kt` | `ImageAnalysis.Analyzer` — computes avg luminance |
| `graph/LuxOverlayView.kt` | Custom `View` — canvas line graph, last 5 s window |
| `ui/light/LightViewModel.kt` | `StateFlow<List<LuxData>>` + windowed buffer |
| `ui/light/LightFragment.kt` | CameraX preview + overlay; landscape constraint swap |
| `export/CsvExporter.kt` (patch) | Add `writeLux()` for `List<LuxData>` |

## Implementation Notes

### LuxData

```kotlin
data class LuxData(
    val timestampMs: Long,
    val relativeLux: Float,   // 0.0 – 1.0 normalised avg luminance
    val frameNumber: Long
)
```

### LuxAnalyzer (FR-10)

```kotlin
class LuxAnalyzer(
    private val onLux: (LuxData) -> Unit
) : ImageAnalysis.Analyzer {
    private var frameCount = 0L
    override fun analyze(image: ImageProxy) {
        val buffer = image.planes[0].buffer
        val bytes = ByteArray(buffer.remaining()).also { buffer.get(it) }
        val avg = bytes.map { it.toInt() and 0xFF }.average().toFloat() / 255f
        onLux(LuxData(System.currentTimeMillis(), avg, frameCount++))
        image.close()
    }
}
```

### LuxOverlayView (FR-11)

- Extends `View`; overrides `onDraw(canvas)`
- Holds a `ArrayDeque<Float>` capped at `fps * 5` entries (≈ 120 at 24 fps)
- Draws a polyline scaled to view height; background semi-transparent black
- Called via `addLux(value: Float)` from `LightFragment` observer

### Landscape Layout (FR-12)

`LightFragment` detects `Configuration.ORIENTATION_LANDSCAPE`:

- Portrait: overlay rendered full-width at bottom 25% of preview
- Landscape: overlay rendered in a right-side `ConstraintLayout` panel,
  `app:layout_constraintStart_toEndOf="@id/cameraPreview"`, fixed 240 dp wide

### Light CSV Export (FR-13)

```
timestamp_ms,relative_lux,frame_number
1716700000000,0.87,0
1716700000042,0.85,1
```

`CsvExporter.writeLux(data: List<LuxData>, label: String)` mirrors the
sensor export pattern with a matching metadata header.

## Hypothesis

I hypothesize that averaging the Y-plane (luminance) of each `ImageProxy`
at ≥ 24 fps will produce a monotonically decreasing lux sequence when the
camera is gradually covered. This would be disproven if the sequence is
non-monotonic in more than 5% of consecutive frame pairs during occlusion.

## Satya Validation Method

Structural — all 6 files listed; FR-10 through FR-13 addressed; `LuxData`
fields match light CSV columns in FR-13; landscape constraint mechanism
documented and consistent with FR-12.

Cross-validation note: monotonic-decrease property can be validated by
covering the camera during a live session and checking the exported CSV
with `python -c "import pandas as pd; df=pd.read_csv('f.csv', comment='#');
print((df.relative_lux.diff().dropna() <= 0).mean())"`.

## Dependencies

- Epic 01 (sensor pipeline): provides ForegroundService pattern to follow
- Epic 02 (data export): `CsvExporter` is patched in this epic
