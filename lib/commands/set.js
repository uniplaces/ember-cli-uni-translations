/* global module, require */
'use strict';

const ReadConfigTask = require('../tasks/read-config');
const spreadsheet = require('../utils/spreadsheet');
const RSVP = require('rsvp');
const logger = require('../utils/logger');

const DEFAULT_LOCALE = 'en-gb';

module.exports = {
  name: 'translate:set',
  aliases: ['t:s'],
  description: 'Set a new translation in the specified Google spreadsheet tab',
  works: 'insideProject',
  availableOptions: [
    { name: 'tab', type: String, aliases: ['t'] },
    { name: 'key', type: String, aliases: ['k'] },
    { name: 'sentence', type: String, aliases: ['s'] },
    { name: 'default', type: String, aliases: ['d'] }
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
        this.locales = locales;
        this.defaultLocale = config.uniTranslations.defaultLocale
          ? config.uniTranslations.defaultLocale
          : DEFAULT_LOCALE;
      })
      .catch(error => {
        logger.error(error);
      });
  },

  run: function (options) {
    let TabSelector = require('../tasks/select-tab.js');
    let tabSelector = new TabSelector({ project: this.project, tabName: options.tab });

    return tabSelector.run().then(tab => this._set(tab[0], options));
  },

  _set: function(tab, options) {
    if (!options.hasOwnProperty('tab')) {
      throw new Error('You must provide a spreadsheet tab name.\nUsage: ember translate:set -t <spreadsheetTabName> -k <key> -s <value> -d <originalLocale>')
    }

    if (!options.hasOwnProperty('key')) {
      throw new Error('You must provide a translation key.\nUsage: ember translate:set -t <spreadsheetTabName> -k <key> -s <value> -d <originalLocale>')
    }

    if (!options.hasOwnProperty('sentence')) {
      throw new Error('You must provide a translation value.\nUsage: ember translate:set -t <spreadsheetTabName> -k <key> -s <value> -d <originalLocale>')
    }

    if (!options.hasOwnProperty('default')) {
      options.default = this.defaultLocale;

      logger.info(`Locale was set to default ${this.defaultLocale}. To change it use -d <originalLocale>`);
    }

    return new RSVP.Promise((resolve, reject) => {
      let row = this._row(options);

      return tab.addRow(row, (err, result) => !err ? resolve(result) : reject(err));
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
    let row = { [this.keyColumn]: options.key }

    this.locales.map(locale => {
      Object.assign(row, {
        [locale]: this._sentence(options.default, locale, options.sentence),
        [`status${locale}`]: this._status(options.default, locale)
      });
    });

    return row;
  }
};
