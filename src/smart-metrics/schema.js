/**
 * Schema validator for smart_metrics.jsonl entries.
 * Enforces the schema defined in 05-VALIDATION-DESIGN.md.
 */

const REQUIRED_FIELDS = [
  'task_id',
  'timestamp',
  'agent',
  'iterations',
  'auto_errors_caught',
  'satya_result',
  'validation_method',
  'loc_generated',
  'loc_manual',
  'time_seconds'
];

const ALLOWED_AGENTS = ['Karma', 'Yukti'];
const ALLOWED_SATYA_RESULTS = ['PASS', 'PARTIAL', 'FAIL'];
const ALLOWED_METHODS = [
  'analytical',
  'benchmark',
  'cross-validation',
  'unit-tests',
  'structural'
];

const TASK_ID_REGEX = /^phase-\d{2}-epic-\d{2}$/;

/**
 * Validates a metrics entry object against the SMART metrics schema.
 * @param {Object} entry The parsed JSON object to validate.
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateEntry(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    return { valid: false, errors: ['Entry must be a JSON object'] };
  }

  const errors = [];

  // 1. Check all required fields are present
  for (const field of REQUIRED_FIELDS) {
    if (!(field in entry)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // If missing fields, return early to avoid type errors on undefined
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // 2. task_id format
  if (typeof entry.task_id !== 'string' || !TASK_ID_REGEX.test(entry.task_id)) {
    errors.push(`task_id must match format 'phase-NN-epic-NN'. Got: ${entry.task_id}`);
  }

  // 3. timestamp format (ISO 8601 UTC parseable)
  if (typeof entry.timestamp !== 'string' || isNaN(new Date(entry.timestamp).getTime())) {
    errors.push(`timestamp must be a valid ISO 8601 date string. Got: ${entry.timestamp}`);
  }

  // 4. agent
  if (!ALLOWED_AGENTS.includes(entry.agent)) {
    errors.push(`agent must be one of: ${ALLOWED_AGENTS.join(', ')}. Got: ${entry.agent}`);
  }

  // 5. non-negative integers
  const intFields = [
    'iterations',
    'auto_errors_caught',
    'loc_generated',
    'loc_manual',
    'time_seconds'
  ];

  for (const field of intFields) {
    const val = entry[field];
    if (!Number.isInteger(val) || val < 0) {
      errors.push(`${field} must be a non-negative integer. Got: ${val}`);
    }
  }

  // 6. satya_result
  if (!ALLOWED_SATYA_RESULTS.includes(entry.satya_result)) {
    errors.push(`satya_result must be one of: ${ALLOWED_SATYA_RESULTS.join(', ')}. Got: ${entry.satya_result}`);
  }

  // 7. validation_method
  if (!ALLOWED_METHODS.includes(entry.validation_method)) {
    errors.push(`validation_method must be one of: ${ALLOWED_METHODS.join(', ')}. Got: ${entry.validation_method}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = { validateEntry };
