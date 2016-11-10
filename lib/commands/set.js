'use strict';

let spreadsheet = require('../utils/spreadsheet');

module.exports = {
  name: 'translate:set',
  aliases: ['t:s'],
  description: 'Set a new translation line in the google spreadsheet file.',
  works: 'insideProject',
  availableOptions: [
    { name: 'tab', type: String, aliases: ['t'] },
    { name: 'key', type: String, aliases: ['k'] },
    { name: 'sentence', type: String, aliases: ['s'] },
    { name: 'default', type: String, aliases: ['d'] }
  ],
  locales: {},
  keyCol: '',

  init: function () {
    let ReadConfigTask = require('../tasks/read-config');
    let readConfig = new ReadConfigTask({project: this.project});

    readConfig.run().then(config => {
      if (!config.locales) {
        throw new SilentError('Missing loacales array in environment configuration.');
      }

      this.keyCol = config.keyCol;
      this.locales = config.locales;
    });
  },

  _sentence: function(defaultLocale, locale, rawSentence) {
    return defaultLocale === locale
      ? rawSentence
      : spreadsheet.googleTranslateFormula(rawSentence, defaultLocale, locale);
  },

  _status: function(defaultLocale, locale) {
    return defaultLocale === locale ? 'ok' : 'needs attention';
  },

  _row: function(options) {
    let row = {[this.keyCol]: options.key}

    this.locales.map(locale => {
      Object.assign(row, {
        [locale]: this._sentence(options.default, locale, options.sentence),
        [`status${locale}`]: this._status(options.default, locale)
      });
    });

    return row;
  },

  _set: function(tab, options) {
    return new Promise((res, rej) => {
      let row = this._row(options);
      
      return tab.addRow(row, (err, result) => !err ? res(result) : rej(err));
    });
  },

  run: function (options) {
    console.log('set translations');

    let TabSelector = require('../tasks/select-tab.js');
    let tabSelector = new TabSelector({project: this.project, tabName: options.tab});

    return tabSelector.run().then(tab => this._set(tab, options));
  }
};
