/* global module */
module.exports = {
  googleTranslateFormula: function(sentence, source, target) {
    return `=GOOGLETRANSLATE("${sentence}", "${_getISO6391Language(source)}", "${_getISO6391Language(target)}")`;
  }
};

function _getISO6391Language(language = '') {
  // This is defined in google translate API: https://cloud.google.com/translate/docs/languages
  const languageCodeExceptions = ['haw', 'hmn', 'zh-cn', 'zh-tw'];

  return languageCodeExceptions.includes(language.toLowerCase()) ? language : language.split('-')[0];
}
