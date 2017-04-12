/* global module, require */
const Task = require('ember-cli/lib/models/task');
const Promise = require('ember-cli/lib/ext/promise');
const TAB_SUMMARY = 'Summary';

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

          return this._getTabs(info, resolve, reject);
        })
      });
    });
  },

  _getTabs(info, resolve, reject) {
    var tabs = [];

    if (this.tabName) {
      tabs = this._getTab(info);

      return tabs.length ? resolve(tabs) : reject(`No tab found with name ${this.tabName}`);
    }

    tabs = this._getAll(info);

    return tabs.length ? resolve(tabs) : reject('No tabs found');
  },

  _getTab(info) {
    return info.worksheets.filter(({ title }) => title === this.tabName);
  },

  _getAll(info) {
    return info.worksheets.filter(({title}) => title !== TAB_SUMMARY);
  }
});
