# translations

Ember addon to manage translations using google spreadsheet.

*Work in progress*

# configuration
In the importer project define the following properties:
 - spreadsheetId: id of the spreadsheet managing the translations (the long id in the spreadsheet url);
 - spreadsheet_cred_file: path to the credentials file (relative to the root of the project);
 - locales: list of locales to expect in the spreadsheet, ex.: ['en-gb', 'es-es', 'it-it', 'pt-pt', 'de-de'];
 - keyCol: title of the column containing the translation key.
