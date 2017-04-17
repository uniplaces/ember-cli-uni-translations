/* global module, require */
const Task = require('ember-cli/lib/models/task');
const RSVP = require('rsvp');

const existsSync = require('fs').existsSync;
const path = require('path');

module.exports = Task.extend({
  init: function() {
    if (this._super.init) {
      this._super.init.apply(this, arguments);
    }

    if (!this.project) {
      throw new Error('No project passed to read-config task');
    }

    this.root = this.project.root;
    this.configPath = this.deployConfigFile || 'config/environment.js';
    this.parentConfigPath = path.resolve(this.root, this.configPath);

    if (!existsSync(this.parentConfigPath)) {
      throw new Error(`Environment config does not exist at ${this.parentConfigPath}`);
    }
  },

  _loadSpreadsheetConfig: function(parentConfig) {
    if (Object.keys(parentConfig._result).length <= 0) {
      throw new Error('The parent config directory was not found.');
    }

    let config = parentConfig._result.uniTranslations;
    let path = `${this.project.root}/${config.spreadsheetCredentialsFile}`;

    if (!existsSync(path)) {
        throw new Error('There is no such credentials file.');
    }

    parentConfig._result.credentials = require(path);

    return parentConfig;
  },

  run: function() {
    let parentConfig = RSVP.resolve(require(this.parentConfigPath)());

    return this._loadSpreadsheetConfig(parentConfig);
  }
});
