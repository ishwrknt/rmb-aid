/**
 * Logger utility for appending valid entries to smart_metrics.jsonl.
 */

const fs = require('node:fs');
const path = require('node:path');
const { validateEntry } = require('./schema');

/**
 * Validates and appends a single metric entry to the specified JSONL file.
 * 
 * @param {Object} entry The metric entry object to log.
 * @param {string} filepath The absolute or relative path to the jsonl file.
 * @returns {{ success: boolean, errors?: string[] }}
 */
function appendMetric(entry, filepath) {
  // 1. Validate the entry against the schema
  const validation = validateEntry(entry);
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }

  // 2. Stringify exactly one line (no pretty-print)
  let line;
  try {
    line = JSON.stringify(entry) + '\n';
  } catch (err) {
    return { success: false, errors: [`Failed to serialize entry: ${err.message}`] };
  }

  // 3. Ensure directory exists
  const dir = path.dirname(filepath);
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    return { success: false, errors: [`Failed to create directory: ${err.message}`] };
  }

  // 4. Append to file
  try {
    fs.appendFileSync(filepath, line, 'utf8');
    return { success: true };
  } catch (err) {
    return { success: false, errors: [`Failed to write to file: ${err.message}`] };
  }
}

module.exports = { appendMetric };
