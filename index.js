/* global module, require */
'use strict';

let commands = require('./lib/commands');

module.exports = {
  name: 'ember-cli-uni-translations',

  includedCommands() {
    return commands;
  }
};
