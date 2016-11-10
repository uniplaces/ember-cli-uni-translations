let Task        = require('ember-cli/lib/models/task');
let Promise     = require('ember-cli/lib/ext/promise');

let existsSync  = require('fs').existsSync;
let path        = require('path');
let SilentError = require('silent-error');

module.exports = Task.extend({
  init: function() {
    if (this._super.init) {
      this._super.init.apply(this, arguments);
    }

    if (!this.project) {
      throw new SilentError('No project passed to read-config task');
    }

    this.root = this.project.root;
    this.configPath = this.deployConfigFile || 'config/environment.js';
    this.superConfigPath = path.resolve(this.root, this.configPath);

    if (!existsSync(this.superConfigPath)) {
      throw new SilentError(`Evironment config does not exist at ${this.superConfigPath}`);
    }
  },

  _loadSpreadsheetConfig: function(superConfig) {
    superConfig._result.credentials = require(`${this.project.root}/${superConfig._result.spreadsheet_cred_file}`);

    return superConfig
  },

  run: function() {
    superConfig = Promise.resolve(require(this.superConfigPath)());

    return this._loadSpreadsheetConfig(superConfig);
  }
});
