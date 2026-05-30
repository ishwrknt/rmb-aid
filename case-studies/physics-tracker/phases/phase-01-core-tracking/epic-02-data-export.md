# Epic 02 — Data Export

Case Study: PhysicsTracker Android App
Phase: phase-01-core-tracking
Agent: Karma

## Goal

Implement the CSV export pipeline: write a valid, metadata-headered CSV from
a `List<SensorData>`, name the file correctly, expose it via `FileProvider`,
and launch the Android share sheet.

## Requirements Covered

FR-06, FR-07, FR-08, FR-09

## Files to Create

| File | Purpose |
|---|---|
| `export/FileNamer.kt` | Generates `pt_[label]_[yyyyMMdd_HHmmss].csv` |
| `export/CsvExporter.kt` | Writes header + data rows; returns `Uri` |
| `ui/export/ExportViewModel.kt` | Calls exporter on `IO` dispatcher; emits share intent |
| `res/xml/file_paths.xml` | `FileProvider` path configuration |
| `AndroidManifest.xml` (patch) | Register `FileProvider` authority |

## Implementation Notes

### CSV Header (FR-07)

```
# PhysicsTracker Export
# Device: [Build.MODEL]
# SampleRate: [N] Hz
# StartTime: [ISO8601]
# Label: [user label]
timestamp_ms,ax,ay,az,gx,gy,gz
```

### CsvExporter

```kotlin
suspend fun write(
    data: List<SensorData>,
    label: String,
    sampleRateHz: Int
): Uri = withContext(Dispatchers.IO) {
    val file = File(context.cacheDir, FileNamer.generate(label))
    file.bufferedWriter().use { writer ->
        writer.appendLine("# PhysicsTracker Export")
        writer.appendLine("# Device: ${Build.MODEL}")
        writer.appendLine("# SampleRate: $sampleRateHz Hz")
        writer.appendLine("# StartTime: ${Instant.now()}")
        writer.appendLine("# Label: $label")
        writer.appendLine("timestamp_ms,ax,ay,az,gx,gy,gz")
        data.forEach { r ->
            writer.appendLine(
                "${r.timestampMs},${r.ax},${r.ay},${r.az}," +
                "${r.gx},${r.gy},${r.gz}"
            )
        }
    }
    FileProvider.getUriForFile(context, "${context.packageName}.provider", file)
}
```

### Share Sheet (FR-08)

```kotlin
val intent = Intent(Intent.ACTION_SEND).apply {
    type = "text/csv"
    putExtra(Intent.EXTRA_STREAM, uri)
    addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
}
startActivity(Intent.createChooser(intent, "Share sensor data"))
```

## Hypothesis

I hypothesize that `BufferedWriter` flushing to the app cache directory will
complete a 5-minute capture (≤ 15 000 rows) in under 2 seconds on API 26+
devices. This would be disproven if wall-clock time for `write()` exceeds 2 s.

## Satya Validation Method

Structural — verify all 5 files listed; CSV column order matches FR-06;
header format matches FR-07; file name regex matches FR-09.

## Dependencies

Epic 01 — sensor pipeline must be complete (provides `SensorData` type).
