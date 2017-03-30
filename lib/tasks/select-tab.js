/* global module, require */
const Task = require('ember-cli/lib/models/task');
const Promise = require('ember-cli/lib/ext/promise');

module.exports = Task.extend({
  run: function() {
    let Authenticate = require('./authenticate');
    let authentication = new Authenticate({project: this.project});

    return authentication.run().then((spreadsheet) => {
      return new Promise((resolve, reject) =>  {
        spreadsheet.getInfo((err, info) => {
          if (err) {
            return reject(err);
          }

          let tab = info.worksheets.filter((tab) => {
            return tab.title === this.tabName
          });

          return tab.length ? resolve(tab[0]) : reject(`No tab found with name ${this.tabName}`);
        })
      });
    });
  }
});
