/* global module, require */
const Task = require('ember-cli/lib/models/task');
const Promise = require('ember-cli/lib/ext/promise');
const GoogleSpreadsheet = require('google-spreadsheet');

module.exports = Task.extend({
  run: function() {
    let ReadConfigTask = require('./read-config');
    let readConfig = new ReadConfigTask({ project: this.project });

    return readConfig.run().then(config => {
      if (!config.uniTranslations.hasOwnProperty("spreadsheetId")) {
        throw new Error('Missing spreadsheet ID in your ENV.uniTranslations configuration.')
      }

      let spreadsheet = new GoogleSpreadsheet(config.uniTranslations.spreadsheetId);

      return new Promise(resolve => {
        spreadsheet.useServiceAccountAuth(config.credentials, resolve.bind(this, spreadsheet));
      });
    });
  }
});
