'use strict';

let commands = require('./lib/commands');

module.exports = {
  name: 'uni-translations',

  includedCommands: function () {return commands;}
};
