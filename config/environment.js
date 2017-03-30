/*jshint node:true*/
/* global module */
'use strict';

module.exports = function(/* environment, appConfig */) {
  var ENV = {};

  ENV.uniTranslations = {
    spreadsheetId: 'fake-spreadsheet-id',
    spreadsheetCredentialsFile: 'config/credentials.json',
    keyColumn: 'forbiddenaccesslabeldonottouch',
    locales: ['en-gb', 'es-es', 'it-it', 'pt-pt', 'de-de']
  }

  return ENV;
};
