const path = require('node:path');
const prompts = require('../prompts');
const { Installer } = require('../core/installer');
const { Manifest } = require('../core/manifest');
const { UI } = require('../ui');

const installer = new Installer();
const manifest = new Manifest();
const ui = new UI();

module.exports = {
  command: 'status',
  description: 'Display RMB_AID installation status and module versions',
  options: [],
  action: async (options) => {
    try {
      // Find the rmbaid directory
      const projectDir = process.cwd();
      const { rmbaidDir } = await installer.findRmbaidDir(projectDir);

      // Check if rmbaid directory exists
      const fs = require('fs-extra');
      if (!(await fs.pathExists(rmbaidDir))) {
        await prompts.log.warn('No RMB_AID installation found in the current directory.');
        await prompts.log.message(`Expected location: ${rmbaidDir}`);
        await prompts.log.message('Run "rmbaid install" to set up a new installation.');
        process.exit(0);
        return;
      }

      // Read manifest
      const manifestData = await manifest._readRaw(rmbaidDir);

      if (!manifestData) {
        await prompts.log.warn('No RMB_AID installation manifest found.');
        await prompts.log.message('Run "rmbaid install" to set up a new installation.');
        process.exit(0);
        return;
      }

      // Get installation info
      const installation = manifestData.installation || {};
      const modules = manifestData.modules || [];

      // Check for available updates (only for external modules)
      const availableUpdates = await manifest.checkForUpdates(rmbaidDir);

      // Display status
      await ui.displayStatus({
        installation,
        modules,
        availableUpdates,
        rmbaidDir,
      });

      process.exit(0);
    } catch (error) {
      await prompts.log.error(`Status check failed: ${error.message}`);
      if (process.env.RMB_AID_DEBUG) {
        await prompts.log.message(error.stack);
      }
      process.exit(1);
    }
  },
};
