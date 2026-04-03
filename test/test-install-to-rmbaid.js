/**
 * install_to_rmbaid Flag — Design Contract Tests
 *
 * Unit tests against the functions that implement the install_to_rmbaid flag.
 * These nail down the 4 core design decisions:
 *
 * 1. true/omitted → skill stays in _rmbaid/ (default behavior)
 * 2. false → skill removed from _rmbaid/ after IDE install
 * 3. No platform → no cleanup runs (cleanup lives in installVerbatimSkills)
 * 4. Mixed flags → each skill evaluated independently
 *
 * Usage: node test/test-install-to-rmbaid.js
 */

const path = require('node:path');
const os = require('node:os');
const fs = require('fs-extra');
const { loadSkillManifest, getInstallToRmbaid } = require('../tools/installer/ide/shared/skill-manifest');

// ANSI colors
const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  yellow: '\u001B[33m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
};

let passed = 0;
let failed = 0;

function assert(condition, testName, errorMessage = '') {
  if (condition) {
    console.log(`${colors.green}✓${colors.reset} ${testName}`);
    passed++;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${testName}`);
    if (errorMessage) {
      console.log(`  ${colors.dim}${errorMessage}${colors.reset}`);
    }
    failed++;
  }
}

async function runTests() {
  console.log(`${colors.cyan}========================================`);
  console.log('install_to_rmbaid — Design Contract Tests');
  console.log(`========================================${colors.reset}\n`);

  // ============================================================
  // 1. true/omitted → getInstallToRmbaid returns true (keep in _rmbaid/)
  // ============================================================
  console.log(`${colors.yellow}Design decision 1: true or omitted → skill stays in _rmbaid/${colors.reset}\n`);

  // Null manifest (no rmbaid-skill-manifest.yaml) → true
  assert(getInstallToRmbaid(null, 'workflow.md') === true, 'null manifest defaults to true');

  // Single-entry, flag omitted → true
  assert(
    getInstallToRmbaid({ __single: { type: 'skill' } }, 'workflow.md') === true,
    'single-entry manifest with flag omitted defaults to true',
  );

  // Single-entry, explicit true → true
  assert(
    getInstallToRmbaid({ __single: { type: 'skill', install_to_rmbaid: true } }, 'workflow.md') === true,
    'single-entry manifest with explicit true returns true',
  );

  console.log('');

  // ============================================================
  // 2. false → getInstallToRmbaid returns false (remove from _rmbaid/)
  // ============================================================
  console.log(`${colors.yellow}Design decision 2: false → skill removed from _rmbaid/${colors.reset}\n`);

  // Single-entry, explicit false → false
  assert(
    getInstallToRmbaid({ __single: { type: 'skill', install_to_rmbaid: false } }, 'workflow.md') === false,
    'single-entry manifest with explicit false returns false',
  );

  // loadSkillManifest round-trip: YAML with false is preserved through load
  {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'rmbaid-itb-'));
    await fs.writeFile(path.join(tmpDir, 'rmbaid-skill-manifest.yaml'), 'type: skill\ninstall_to_rmbaid: false\n');
    const loaded = await loadSkillManifest(tmpDir);
    assert(getInstallToRmbaid(loaded, 'workflow.md') === false, 'loadSkillManifest preserves install_to_rmbaid: false through round-trip');
    await fs.remove(tmpDir);
  }

  console.log('');

  // ============================================================
  // 3. No platform → cleanup only runs inside installVerbatimSkills
  //    (This is a design invariant: getInstallToRmbaid is only consulted
  //     during IDE install. Without a platform, the flag has no effect.)
  // ============================================================
  console.log(`${colors.yellow}Design decision 3: flag is a per-skill property, not a pipeline gate${colors.reset}\n`);

  // The flag value is stored but doesn't trigger any side effects by itself.
  // Cleanup is driven by reading the CSV column inside installVerbatimSkills.
  // We verify the flag is just data — getInstallToRmbaid doesn't touch the filesystem.
  {
    const manifest = { __single: { type: 'skill', install_to_rmbaid: false } };
    const result = getInstallToRmbaid(manifest, 'workflow.md');
    assert(typeof result === 'boolean', 'getInstallToRmbaid returns a boolean (pure data, no side effects)');
    assert(result === false, 'false value is faithfully returned for consumer to act on');
  }

  console.log('');

  // ============================================================
  // 4. Mixed flags → each skill evaluated independently
  // ============================================================
  console.log(`${colors.yellow}Design decision 4: mixed flags — each skill independent${colors.reset}\n`);

  // Multi-entry manifest: different files can have different flags
  {
    const manifest = {
      'workflow.md': { type: 'skill', install_to_rmbaid: false },
      'other.md': { type: 'skill', install_to_rmbaid: true },
    };
    assert(getInstallToRmbaid(manifest, 'workflow.md') === false, 'multi-entry: workflow.md with false returns false');
    assert(getInstallToRmbaid(manifest, 'other.md') === true, 'multi-entry: other.md with true returns true');
    assert(getInstallToRmbaid(manifest, 'unknown.md') === true, 'multi-entry: unknown file defaults to true');
  }

  console.log('');

  // ============================================================
  // Summary
  // ============================================================
  console.log(`${colors.cyan}========================================`);
  console.log('Results:');
  console.log(`  Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`  Failed: ${colors.red}${failed}${colors.reset}`);
  console.log(`========================================${colors.reset}\n`);

  if (failed === 0) {
    console.log(`${colors.green}All install_to_rmbaid contract tests passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}Some install_to_rmbaid contract tests failed${colors.reset}\n`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error(`${colors.red}Test runner failed:${colors.reset}`, error.message);
  console.error(error.stack);
  process.exit(1);
});
