/* global module, require */
const Task = require('ember-cli/lib/models/task');
const RSVP = require('rsvp');
const GoogleSpreadsheet = require('google-spreadsheet');
const logger = require('../utils/logger');

module.exports = Task.extend({
  run: function() {
    let ReadConfigTask = require('./read-config');
    let readConfig = new ReadConfigTask({ project: this.project });

    return readConfig.run().then(config => {
      if (!config.uniTranslations.hasOwnProperty("spreadsheetId")) {
        throw new Error('Missing spreadsheet ID in your ENV.uniTranslations configuration.')
      }

      logger.info(`Reading translations from spreadsheet: ${config.uniTranslations.spreadsheetId}`);

      let spreadsheet = new GoogleSpreadsheet(config.uniTranslations.spreadsheetId);

      return new RSVP.Promise(resolve => {
        spreadsheet.useServiceAccountAuth(config.credentials, resolve.bind(this, spreadsheet));
      });
    });
  }
});
