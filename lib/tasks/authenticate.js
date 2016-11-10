let Task              = require('ember-cli/lib/models/task');
let Promise           = require('bluebird');
let GoogleSpreadsheet = require('google-spreadsheet');

module.exports = Task.extend({
  run: function() {
    let ReadConfigTask = require('./read-config');
    let readConfig = new ReadConfigTask({project: this.project});

    return authentication = readConfig.run().then(config => {
      let spreadsheet = new GoogleSpreadsheet(config.spreadsheetId);

      return new Promise(res => {
        spreadsheet.useServiceAccountAuth(config.credentials, res.bind(this, spreadsheet));
      });
    });
  }
});
