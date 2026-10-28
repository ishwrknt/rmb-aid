const fs = require('node:fs');
const path = require('node:path');

module.exports = {
  command: 'prompt',
  description: 'Print the SMART runtime prompt for any coding assistant (works offline)',
  options: [],
  action() {
    const skill = fs.readFileSync(path.join(__dirname, '../../../src/smart-skills/smart-pipeline/SKILL.md'), 'utf8');
    process.stdout.write(skill.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').trimStart());
  },
};
