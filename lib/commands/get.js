/* global module, require */
'use strict';

const ReadConfigTask = require('../tasks/read-config');
const filesystem = require('../utils/filesystem');
const Promise = require('ember-cli/lib/ext/promise');

module.exports = {
  name: 'translate:get',
  aliases: ['t:g'],
  description: 'Generate one or more translations\' files by parsing a Google spreadsheet tab',
  works: 'insideProject',
  availableOptions: [
    { name: 'tab', type: String, aliases: ['t'] }
  ],
  locales: {},
  keyColumn: '',

  init: function () {
    this._super(...arguments);

    let readConfig = new ReadConfigTask({ project: this.project });

    readConfig.run()
      .then(config => {
        let locales = config.uniTranslations.locales;

        if (locales.length <= 0) {
          throw new Error('Missing locales array in your ENV.uniTranslations configuration.');
        }

        if (!config.uniTranslations.hasOwnProperty('keyColumn')) {
          throw new Error('Missing key column (keyColumn) in your ENV.uniTranslations configuration.');
        }

        this.keyColumn = config.uniTranslations.keyColumn;
        locales.map(item => { this.locales[item] = {} });
      })
      .catch(error => {
        console.error(error);
      });
  },

  run: function (options) {
    let TabSelector = require('../tasks/select-tab.js');
    let tabSelector = new TabSelector({ project: this.project, tabName: options.tab });

    return tabSelector.run().then(tabs => this._rowsByTabs(tabs));
  },

  _rowsByTabs(tabs) {
    return Promise.all(tabs.map(this._rowsByTab.bind(this))).then(rowsByTab => {
      let mergedRows = [].concat.apply([], rowsByTab);

      return this._save(this._initTranslations(this.locales, mergedRows));
    });
  },

  _rowsByTab(tab) {
    return new Promise((resolve, reject) => {
      return tab.getRows({offset: 0, limit: tab.rowCount}, (err, rows) => {
        return err ? reject(err) : resolve(rows);
      });
    });
  },

  _initTranslations: function (locales, rows) {
    let translations = locales;

    rows.forEach((row) => {
      Object.keys(locales).map(locale => {
        let translationKey = row[this.keyColumn];
        translations[locale][translationKey] = row[locale];
      });
    });

    return translations;
  },

  _save: function(translations) {
    Object.keys(translations).forEach(locale => {
      filesystem.write(filesystem.path(locale), this._content(translations[locale]));
    });
  },

  _content: function(translation) {
    let translationAsString = JSON.stringify(translation, null, 2);

    return `export default ${translationAsString};`;
  }
};
