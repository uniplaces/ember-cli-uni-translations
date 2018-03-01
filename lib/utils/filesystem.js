/* global module, require, Buffer */
const existsSync = require('fs').existsSync;
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

module.exports = {
  path: function (locale) {
    return `app/locales/${locale}/translations.js`;
  },

  dirname: function (filepath) {
    return path.dirname(filepath);
  },

  dirSync: function (filepath) {
    if (!filepath) {
      logger.error('There is no filepath defined.');

      throw new Error('Filepath missing');
    }

    let dir = this.dirname(filepath);

    if (!existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  },

  write: function (filepath, content) {
    this.dirSync(filepath);

    fs.writeFileSync(filepath, Buffer.from(content));
  }
};
