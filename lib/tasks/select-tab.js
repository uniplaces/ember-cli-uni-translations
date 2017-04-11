/* global module, require */
const Task = require('ember-cli/lib/models/task');
const Promise = require('ember-cli/lib/ext/promise');

module.exports = Task.extend({
  run: function() {
    let Authenticate = require('./authenticate');
    let authentication = new Authenticate({project: this.project});

    return authentication.run().then((spreadsheet) => {
      return new Promise((resolve, reject) =>  {
        spreadsheet.getInfo((err, info) => {
          if (err) {
            return reject(err);
          }

          if (this.tabName) {
            var tabs = this._getTab(info);
            var errorMessage = `No tab found with name ${this.tabName}`;
          } else {
            var tabs = this._getAll(info);
            var errorMessage = 'No tabs found';
          }

          return tabs.length ? resolve(tabs) : reject(errorMessage);
        })
      });
    });
  },

  _getTab (info) {
    return info.worksheets.filter((tab) => {
      return tab.title === this.tabName
    });
  },

  _getAll (info) {
    return info.worksheets.filter((tab) => {
      return tab.title !== 'Summary'
    });
  }
});
