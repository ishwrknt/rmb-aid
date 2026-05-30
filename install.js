/* eslint-disable unicorn/prefer-module */

const args = process.argv.slice(2);

if (args.length === 0 || args[0].startsWith('-')) {
  process.argv.splice(2, 0, 'install');
}

require('./tools/installer/rmbaid-cli.js');
