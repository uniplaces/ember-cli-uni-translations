/* global module, require, Buffer */
const existsSync = require('fs').existsSync;
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const FORMATS = {
  I18N: 'i18n',
  INTL: 'intl'
};

module.exports = {
  path(locale, format) {
    if (format === FORMATS.INTL) {
      return `translations/${locale}.json`;
    }

    return `app/locales/${locale}/translations.js`;
  },

  dirname(filepath) {
    return path.dirname(filepath);
  },

  dirSync(filepath) {
    if (!filepath) {
      logger.error('There is no filepath defined.');

      throw new Error('Filepath missing');
    }

    let dir = this.dirname(filepath);

    if (!existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  },

  write(filepath, content) {
    this.dirSync(filepath);

    fs.writeFileSync(filepath, Buffer.from(content));
  }
};
