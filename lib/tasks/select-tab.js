let Task = require('ember-cli/lib/models/task');

module.exports = Task.extend({
  run: function() {
    let Authenticate = require('./authenticate');
    let authentication = new Authenticate({project: this.project});

    return tabHandler = authentication.run().then((spreadsheet) => {
      return new Promise((res, rej) =>  {
        spreadsheet.getInfo((err, info) => {
          if (err) return rej(err);
          let tab = info.worksheets.filter((tab) => {
            return tab.title === this.tabName
          });

          return tab.length ? res(tab[0]) : rej(`No tab found for ${this.tabName}`);
        })
      });
    });
  }
});
