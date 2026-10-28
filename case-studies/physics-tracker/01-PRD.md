# 01 — PhysicsTracker: Product Requirements Document

Version: 1.0.0
Platform: Kotlin / Android (minSdk 26, targetSdk 34)
Phase scope: Phase 1 — Core Tracking Features

---

## 1. Problem Statement

Students need a portable, accurate way to capture sensor data during lab
experiments. Existing apps either lack export capability, run only on recent
devices, or don't support the light-analysis workflow required for optics labs.

---

## 2. Users

| User            | Goal                                                   |
| --------------- | ------------------------------------------------------ |
| Physics student | Record and export a sensor run during a lab experiment |
| Lab instructor  | Review exported CSV files for marking                  |
| SMART agent     | Build and validate each feature epic autonomously      |

---

## 3. Functional Requirements — Sensor Pipeline

### FR-01 — Real-Time Accelerometer Capture

The app MUST read accelerometer data at a configurable sample rate
(10 Hz, 25 Hz, 50 Hz) using `SensorManager`.

### FR-02 — Real-Time Gyroscope Capture

The app MUST read gyroscope data at the same configured sample rate
as the accelerometer, synchronised to the same timestamp source.

### FR-03 — Timestamped Data Stream

Every sensor reading MUST carry a nanosecond-precision timestamp
(`SensorEvent.timestamp`) converted to milliseconds since epoch.

### FR-04 — Background Capture via Foreground Service

Capture MUST continue when the screen is off or the app is backgrounded,
using an Android `ForegroundService` with a persistent notification.

### FR-05 — Configurable Sample Rate UI

The user MUST be able to select sample rate from a dropdown or radio
group before starting a capture session.

---

## 4. Functional Requirements — Data Export

### FR-06 — CSV Export Format

Exported files MUST use the following column structure:

```
timestamp_ms,ax,ay,az,gx,gy,gz
```

### FR-07 — Metadata Header

The first 5 lines of every CSV MUST be a comment block:

```
# PhysicsTracker Export
# Device: [Build.MODEL]
# SampleRate: [N] Hz
# StartTime: [ISO8601]
# Label: [user-entered experiment label]
```

### FR-08 — Share Sheet Integration

After export, the app MUST offer the file via `FileProvider` through
the Android share sheet so users can send to email, Drive, or USB.

### FR-09 — File Naming Convention

Exported files MUST be named: `pt_[label]_[yyyyMMdd_HHmmss].csv`

---

## 5. Functional Requirements — Light Analysis

### FR-10 — Frame-by-Frame Lux Sampling

The app MUST compute average pixel luminance per camera frame using
`ImageAnalysis` from CameraX and convert to a relative lux estimate.

### FR-11 — Overlay Graph During Capture

A line graph overlay MUST be rendered on top of the camera preview
showing the last 5 seconds of lux values in real time.

### FR-12 — Landscape Persistent Graph

During landscape light-analysis capture, the graph MUST remain visible
and non-obstructive on the right side of the screen at all times.

### FR-13 — Light Analysis CSV Export

Exported light-analysis data MUST use this column structure:

```
timestamp_ms,relative_lux,frame_number
```

---

## 6. Non-Functional Requirements

| ID     | Requirement                                                |
| ------ | ---------------------------------------------------------- |
| NFR-01 | Sensor pipeline must not drop readings at 50 Hz on API 26+ |
| NFR-02 | UI must remain responsive during background capture        |
| NFR-03 | App must not crash on orientation change during capture    |
| NFR-04 | CSV export must complete in < 2 s for runs up to 5 minutes |
| NFR-05 | Light analysis overlay must update at ≥ 24 fps             |

---

## 7. Acceptance Tests

| ID    | Test                                                 | Expected                 |
| ----- | ---------------------------------------------------- | ------------------------ |
| AT-01 | Start 50 Hz capture for 60 s; count rows in CSV      | ≥ 2 900 rows             |
| AT-02 | Export CSV; open in Python/pandas; parse all columns | No parse errors          |
| AT-03 | Rotate device during capture; resume                 | No crash; data continues |
| AT-04 | Cover camera in light-analysis mode                  | Lux drops monotonically  |
| AT-05 | Background capture; lock screen; unlock after 30 s   | Data gap < 50 ms         |

---

## 8. Architecture

See `03-ARCHITECTURE.md`
