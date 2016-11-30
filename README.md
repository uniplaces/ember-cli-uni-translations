# translations

`npm i ember-cli-uni-translations --save`

Ember addon to manage translations using google spreadsheet.

Managing translations with google spreadsheet can be painfull when developing a feature.
Translations is a cli for ember projects to get/set translations using a specific spreadsheet-tab standard setting translations under `app/locales`.

Translations spredsheet will be formatted with a key column to store the key for the translation and two column for each locale, the tranlation itself and the status.

# configuration
In the importer project define the following properties:
 - *spreadsheetId*: id of the spreadsheet managing the translations (the long id in the spreadsheet url);
 - *spreadsheet_cred_file*: path to the credentials file (relative to the root of the project);
 - *locales*: list of locales to expect in the spreadsheet, ex.: ['en-gb', 'es-es', 'it-it', 'pt-pt', 'de-de'];
 - *keyCol*: title of the column containing the translation key.

# Usage
After setting the configs, from root of the ember project, in order to download translations from the spreadsheet to the locales folder, run:

`ember translate:get -t <tab_name>`

To set a key in the spreadsheet run:

`ember translate:set -t <tab_name> -k <my.translation.key> -s '<my great tranlation sentence>' -d <locale_for_sentence>`

The command will populate the first free line in the spreadsheet translating the sentence for the specified locales and setting the status to "ok" for the specified locale and "need attention" for the locales translated with google translate.

*N.B.* 
- The locale has to be in the as defined in the config
- *GOOGLE TRANSLATE should be thought as a placeholder, always check the result for the translated languages*

# *Work in progress* todo
 - Read configurations from uni-translations inside ENV.
 - Verify for existing key.
 -  set parsing csv.
 - escape translation for google tranlate function in the spreadsheet.
 
 # Suggest us improvements, open an issue!
