# 03 — PhysicsTracker: Architecture

Platform: Kotlin / Android (minSdk 26, targetSdk 34)
Pattern: MVVM + Repository + Kotlin Coroutines + StateFlow

---

## Module Layout

```
app/
├── src/main/
│   ├── java/com/phystracker/
│   │   ├── ui/
│   │   │   ├── MainActivity.kt          ← nav host, orientation handling
│   │   │   ├── tracking/
│   │   │   │   ├── TrackingFragment.kt  ← sensor capture UI
│   │   │   │   └── TrackingViewModel.kt ← exposes StateFlow<SensorState>
│   │   │   ├── light/
│   │   │   │   ├── LightFragment.kt     ← CameraX preview + overlay graph
│   │   │   │   └── LightViewModel.kt   ← exposes StateFlow<LuxState>
│   │   │   └── export/
│   │   │       └── ExportViewModel.kt  ← triggers CSV write + share
│   │   ├── sensor/
│   │   │   ├── SensorRepository.kt     ← SensorManager wrapper
│   │   │   ├── SensorData.kt           ← data class (ts, ax, ay, az, gx, gy, gz)
│   │   │   └── CaptureService.kt       ← ForegroundService
│   │   ├── light/
│   │   │   ├── LuxAnalyzer.kt          ← ImageAnalysis.Analyzer impl
│   │   │   └── LuxData.kt              ← data class (ts, lux, frame)
│   │   ├── export/
│   │   │   ├── CsvExporter.kt          ← writes CSV, returns Uri
│   │   │   └── FileNamer.kt            ← pt_[label]_[timestamp].csv
│   │   └── graph/
│   │       └── LuxOverlayView.kt       ← custom View, canvas-based graph
│   └── res/
│       ├── layout/                     ← XML layouts
│       └── values/                     ← strings, styles
└── build.gradle.kts
```

---

## Key Dependencies

| Library | Version | Purpose |
|---|---|---|
| CameraX | 1.3.x | Camera preview + ImageAnalysis |
| Kotlin Coroutines | 1.7.x | Async sensor stream |
| Lifecycle ViewModel | 2.7.x | MVVM state holders |
| Navigation Component | 2.7.x | Fragment navigation |

---

## Data Flow: Sensor Pipeline

```
SensorManager
    │  onSensorChanged(event)
    ▼
SensorRepository
    │  emit SensorData to StateFlow
    ▼
CaptureService (ForegroundService)
    │  collects while active
    │  buffers to in-memory list
    ▼
TrackingViewModel
    │  exposes StateFlow<List<SensorData>>
    ▼
TrackingFragment  ──▶  ExportViewModel ──▶  CsvExporter ──▶  FileProvider
```

---

## Data Flow: Light Analysis

```
CameraX ImageAnalysis
    │  Analyzer callback per frame
    ▼
LuxAnalyzer
    │  compute avg luminance → relative lux
    │  emit LuxData to Channel
    ▼
LightViewModel
    │  StateFlow<List<LuxData>> (last 5s window)
    ▼
LightFragment
    ├──▶  CameraX Preview (camera feed)
    └──▶  LuxOverlayView (real-time graph, right panel in landscape)
```

---

## Orientation Handling

- `MainActivity` declares `android:configChanges="orientation|screenSize"`
- `LightFragment` listens to configuration changes and repositions
  `LuxOverlayView` to the right panel in landscape via constraint updates
- `TrackingViewModel` retains capture state across rotation via `SavedStateHandle`

---

## Export Flow

```
User taps "Export"
    ▼
ExportViewModel.export(label)
    ▼
CsvExporter.write(data, label)   ← runs on IO dispatcher
    │  creates: pt_[label]_[ts].csv in app cache
    ▼
FileProvider.getUriForFile()
    ▼
Android Share Sheet (ACTION_SEND)
```

---

## FR Coverage

| Requirement | Covered by |
|---|---|
| FR-01 Accelerometer | `SensorRepository` + `CaptureService` |
| FR-02 Gyroscope | `SensorRepository` (dual sensor registration) |
| FR-03 Timestamps | `SensorData.timestamp` (ns → ms conversion) |
| FR-04 Background | `CaptureService` (ForegroundService) |
| FR-05 Sample rate UI | `TrackingFragment` spinner → `SensorRepository` delay |
| FR-06 CSV format | `CsvExporter.write()` column order |
| FR-07 Metadata header | `CsvExporter.writeHeader()` |
| FR-08 Share sheet | `ExportViewModel` + `FileProvider` |
| FR-09 File naming | `FileNamer.generate(label)` |
| FR-10 Lux sampling | `LuxAnalyzer.analyze()` |
| FR-11 Overlay graph | `LuxOverlayView` on top of preview |
| FR-12 Landscape graph | Constraint layout switch in `LightFragment` |
| FR-13 Light CSV | `CsvExporter.writeLux()` |
