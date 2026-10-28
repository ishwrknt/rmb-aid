const fs = require('node:fs');
const path = require('node:path');
const { validateEntry } = require('../../src/smart-metrics/schema');
const { appendMetric } = require('../../src/smart-metrics/logger');

const TEST_FILE = path.join(__dirname, 'test_metrics.jsonl');

function setup() {
  if (fs.existsSync(TEST_FILE)) {
    fs.unlinkSync(TEST_FILE);
  }
}

function teardown() {
  if (fs.existsSync(TEST_FILE)) {
    fs.unlinkSync(TEST_FILE);
  }
}

function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      passed++;
      console.log(`✅ PASS: ${message}`);
    } else {
      failed++;
      console.error(`❌ FAIL: ${message}`);
    }
  }

  setup();

  const validEntry = {
    task_id: 'phase-01-epic-01',
    timestamp: '2026-05-30T07:00:00Z',
    agent: 'Karma',
    iterations: 1,
    auto_errors_caught: 0,
    satya_result: 'PASS',
    validation_method: 'unit-tests',
    loc_generated: 100,
    loc_manual: 0,
    time_seconds: 60,
  };

  // Test 1: Valid entry validation
  const val1 = validateEntry(validEntry);
  assert(val1.valid, 'Valid entry passes validation');

  // Test 2: Missing field
  const missingField = { ...validEntry };
  delete missingField.agent;
  const val2 = validateEntry(missingField);
  assert(!val2.valid && val2.errors.includes('Missing required field: agent'), 'Catches missing required field');

  // Test 3: Type mismatch (negative integer)
  const negativeInt = { ...validEntry, iterations: -1 };
  const val3 = validateEntry(negativeInt);
  assert(!val3.valid && val3.errors.some((e) => e.includes('iterations')), 'Catches negative integer');

  // Test 4: Invalid enum value
  const invalidEnum = { ...validEntry, satya_result: 'MAYBE' };
  const val4 = validateEntry(invalidEnum);
  assert(!val4.valid && val4.errors.some((e) => e.includes('satya_result')), 'Catches invalid enum value');

  // Test 5: Append valid entry to file
  const appendRes = appendMetric(validEntry, TEST_FILE);
  assert(appendRes.success, 'Appends valid entry successfully');

  // Test 6: Verify file content
  const content = fs.readFileSync(TEST_FILE, 'utf8');
  assert(content.trim() === JSON.stringify(validEntry), 'File contains correct JSONL string');

  // Test 7: Append invalid entry fails safely
  const appendInvalid = appendMetric(invalidEnum, TEST_FILE);
  assert(!appendInvalid.success && appendInvalid.errors.length > 0, 'Fails safely on invalid entry append');

  teardown();

  console.log(`\nTests complete: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
