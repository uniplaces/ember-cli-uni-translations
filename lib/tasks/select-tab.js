/* global module, require */
const Task = require('ember-cli/lib/models/task');
const RSVP = require('rsvp');
const TAB_SUMMARY = 'Summary';
const TAB_GENERAL = 'General';
const logger = require('../utils/logger');

module.exports = Task.extend({
  run: function() {
    let Authenticate = require('./authenticate');
    let authentication = new Authenticate({project: this.project});

    return authentication.run().then((spreadsheet) => {
      return new RSVP.Promise((resolve, reject) =>  {
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
      logger.info('Fetching single tab...');

      tabs = this._getTab(info);

      logger.info('Fetched the following tab successfully:');
      tabs.forEach((tab) => console.info(`-> ${tab.title}`));

      return tabs.length ? resolve(tabs) : reject(`No tab found with name ${this.tabName}`);
    }

    logger.info('Fetching all tabs...');

    tabs = this._getAll(info);

    logger.info('Fetched the following tabs successfully:');
    tabs.forEach((tab) => console.info(`-> ${tab.title}`));

    return tabs.length ? resolve(tabs) : reject('No tabs found');
  },

  _getTab(info) {
    return info.worksheets.filter(({ title }) => title === this.tabName);
  },

  _getAll(info) {
    return info.worksheets.filter(({ title }) => title !== TAB_SUMMARY && title !== TAB_GENERAL);
  }
});
