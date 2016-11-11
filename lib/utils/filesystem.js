let existsSync = require('fs').existsSync;
let fs         = require('fs');
let path       = require('path');

const DRWXR_XR_X = 0755;

module.exports = {
  path: function (locale) {
    return `app/locales/${locale}/translations.js`;
  },

  dirname: function (filepath) {
    return path.dirname(filepath);
  },

  dirSync: function (filepath, permissions = DRWXR_XR_X) {
    if (!filepath) {
      throw new SilentError('Filepath missing');
    }

    let dir = this.dirname(filepath);

    if (!existsSync(dir)) {
      fs.mkdirSync(dir, permissions);
    }
  },

  write: function (filepath, content) {
    this.dirSync(filepath);

    fs.writeFileSync(filepath, new Buffer(content));
  }
};
