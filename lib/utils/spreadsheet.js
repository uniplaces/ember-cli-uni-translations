module.exports = {
  googleTranslateFormula: function(sentence, source, target) {
    return `=GOOGLETRANSLATE("${sentence}", "${source}", "${target}")`;
  }
};
