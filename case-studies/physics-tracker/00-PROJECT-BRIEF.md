# 00 — PhysicsTracker: Project Brief

## Application Name

PhysicsTracker — Android Physics Measurement App

## Platform

- Language: Kotlin
- Platform: Android (minSdk 26, targetSdk 34)
- Architecture: MVVM with Kotlin coroutines and Flow
- Build: Gradle (Kotlin DSL)

## One-Line Summary

A real-time Android application that uses device sensors and camera to
capture, visualise, and export physics measurements for student lab experiments.

## Background

Physics students frequently need to record and analyse real-world phenomena
(pendulum motion, free fall, light intensity decay, gyroscopic precession)
but lack portable, low-cost measurement tools. PhysicsTracker turns any
Android phone into a calibrated physics instrument.

The app was previously built and partially stabilised through prior SMART
sessions. This case study documents the SMART planning layer for the three
core feature areas that constitute Phase 1 of the app.

## Feature Areas (Phase 1)

### 1. Sensor Pipeline

Real-time reading from accelerometer and gyroscope. Timestamped data stream,
configurable sample rate, background capture via foreground service.

### 2. Data Export

Export captured sensor runs as CSV files. Includes metadata header (device,
sample rate, start time, experiment label). Shareable via Android share sheet.

### 3. Light Analysis

Camera-based lux measurement using average pixel luminance. Frame-by-frame
sampling, overlay graph during capture, export as time-series CSV.

## Success Criteria

1. Sensor pipeline streams data at ≥ 50 Hz without dropped frames on
   mid-range hardware (API 26+)
2. Export produces valid, parseable CSV with correct column headers
3. Light analysis correctly tracks intensity decay in a dimming environment
   (monotonic decrease verified against reference lux meter)
4. All three workflows run end-to-end without crashes in landscape orientation

## Out of Scope (Phase 1)

- Cloud sync or remote data storage
- Multi-sensor fusion (combining accelerometer + camera simultaneously)
- Bluetooth peripheral sensors
- iOS port
