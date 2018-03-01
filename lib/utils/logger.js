/* global module */
module.exports = {
  info() {
    console.info(`[ember-cli-uni-translations]`, ...arguments);
  },
  error() {
    console.error(`[ember-cli-uni-translations] ⚠`, ...arguments);
  }
}
