'use strict';

let filesystem = require('../utils/filesystem');

module.exports = {
  name: 'translate:get',
  aliases: ['t:g'],
  description: 'Parse google spreadsheet file to generate translations.',
  works: 'insideProject',
  availableOptions: [
    { name: 'tab', type: String, aliases: ['t'] }
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
      config.locales.map(item => { this.locales[item] = {} });
    });
  },

  _content: function(translation) {
    let prettyTranslsation = JSON.stringify(translation, null, 2);

    return `export default ${prettyTranslsation};`;
  },

  _initTranslations: function (locales, rows) {
    let translations = locales;

    rows.forEach((row) => {
      Object.keys(locales).map(locale => {
        const translationKey = row[this.keyCol];
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

  _rows: function(tab) {
    return new Promise((res, rej) => {
      return tab.getRows({offset: 0, limit: tab.rowCount}, (err, rows) => {
        if (err) return rej(err);

        let translations = this._initTranslations(this.locales, rows);
        this._save(translations);

        return res(rows);
      });
    });
  },

  run: function (options) {
    console.log('get translations');
    let TabSelector = require('../tasks/select-tab.js');
    let tabSelector = new TabSelector({project: this.project, tabName: options.tab});

    return tabSelector.run().then(tab => this._rows(tab));
  }
};
