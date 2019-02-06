/* global module, require */
'use strict';

const ReadConfigTask = require('../tasks/read-config');
const filesystem = require('../utils/filesystem');
const RSVP = require('rsvp');
const logger = require('../utils/logger');

const DEFAULT_FORMAT = 'i18n';
const INVALID_CELL_CONTENTS = [
  'Loading...',
  '#REF',
  '#VALUE'
];

module.exports = {
  name: 'translate:get',
  aliases: ['t:g'],
  description: 'Generate one or more translations\' files by parsing a Google spreadsheet tab',
  works: 'insideProject',
  availableOptions: [
    { name: 'tab',                  type: String,  aliases: ['t'] },
    { name: 'ignore-empty-strings', type: Boolean, aliases: ['ies'], default: true }
  ],
  locales: {},
  keyColumn: '',
  config: null,

  init() {
    this._super(...arguments);

    let readConfig = new ReadConfigTask({ project: this.project });

    readConfig.run()
      .then((config) => {
        this.config = config;

        let locales = config.uniTranslations.locales;

        if (locales.length <= 0) {
          throw new Error('Missing locales array in your ENV.uniTranslations configuration.');
        }

        logger.info('Fetching translations from the following locales: ')
        locales.forEach((locale) => console.info(`-> ${locale}`));

        if (!config.uniTranslations.hasOwnProperty('keyColumn')) {
          throw new Error('Missing key column (keyColumn) in your ENV.uniTranslations configuration.');
        }

        this.keyColumn = config.uniTranslations.keyColumn;
        locales.map(item => { this.locales[item] = {} });
      })
      .catch(error => logger.error(error));
  },

  run(options) {
    let TabSelector = require('../tasks/select-tab.js');
    let tabSelector = new TabSelector({ project: this.project, tabName: options.tab });

    logger.info(`Ignoring empty strings: ${options.ignoreEmptyStrings ? '✔' : '✘' }`);

    return tabSelector.run().then(tabs => this._rowsByTabs(tabs, options));
  },

  _rowsByTabs(tabs, options) {
    return RSVP.Promise.all(tabs.map(this._rowsByTab.bind(this))).then((rowsByTab) => {
      let mergedRows = [].concat.apply([], rowsByTab);

      return this._save(this._initTranslations(this.locales, mergedRows, options));
    });
  },

  _rowsByTab(tab) {
    return new RSVP.Promise((resolve, reject) => {
      return tab.getRows({ offset: 0, limit: tab.rowCount }, (err, rows) => {
        return err ? reject(err) : resolve(rows);
      });
    });
  },

  _initTranslations(locales, rows, options) {
    let translations = locales;

    rows.forEach((row) => Object.keys(locales).map((locale) => {
      let translationKey = row[this.keyColumn];
      let translation = row[locale];

      if (translation === undefined) {
        let escapedLocale = locale.replace(/[\s-]+/g, '').toLowerCase();
        translation = row[escapedLocale];

        if (translation === undefined) {
          logger.error(`Fetching the locale ${locale} from row ${JSON.stringify(row, null, 2)} has returned ${translation}.`);

          throw new Error();
        }
      }

      this._isTranslationValid(translationKey, locale, translation);

      if (!(options.ignoreEmptyStrings && translation === "")) {
        translations[locale][translationKey] = translation;
      }
    }));

    return translations;
  },

  _save(translations) {
    let format = this._getFormat();

    Object.keys(translations).forEach(locale => {
      let path = filesystem.path(locale, format);

      filesystem.write(path, this._content(translations[locale], format));
    });

    logger.info("Finished!")
  },

  _content(translation, format) {
    let translationAsString = JSON.stringify(translation, null, 2);

    return format === DEFAULT_FORMAT ? `export default ${translationAsString};` : translationAsString;
  },

  _isTranslationValid(key, locale, translation) {
    let isInvalid = INVALID_CELL_CONTENTS.includes(translation);
    if (isInvalid) {
      logger.error(`The translation ${key} returned an invalid content for locale ${locale}`);
    }

    return !isInvalid;
  },

  _getFormat() {
    return this.config.uniTranslations.format || DEFAULT_FORMAT;
  }
};
