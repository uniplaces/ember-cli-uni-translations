# ember-cli-uni-translations

This add-on provides a client (cli) to make it easier to manage translations which are stored using Google Spreadsheets. It provides two commands: one to get all translations and one to set a translation.
It stores the translations under a default folder: `app/locales`.

This add-on generates a different file for each locale, consisting of JSONs with the translations key and value.

## Installation

To install ember-cli-uni-translations you just need npm.

```bash
$ ember install ember-cli-uni-translations
```

## Setup

In order to setup ember-cli-uni-translations for your project, you will need to configure your Ember `environment.js`.

```js
ENV.uniTranslations = {
  spreadsheetId: 'fake-spreadsheet-id',
  spreadsheetCredentialsFile: 'config/dummy.json',
  keyColumn: 'forbiddenaccesslabeldonottouch',
  locales: ['en-gb', 'es-es', 'it-it', 'pt-pt', 'de-de']
}
```

The `spreadsheetCredentialsFile` represents the relative path to your credentials file, given your project's root directory.

## Available commands

### Get all translations

To get all translations, simply run the following command on your terminal:

```bash
$ ember translate:get -t <spreadsheetTabName>
```

* `spreadsheetTabName`: the tab name from the Google spreadsheet where the translations are to be kept. Example: `self_service`.

### Set a translation

To set a translation, run the following command on your terminal:

```bash
$ ember translate:set -t <spreadsheetTabName> -k <key> -s <value> -d <originalLocale>
```

* `spreadsheetTabName`: the tab name from the Google spreadsheet where the translations are to be kept. Example: `self_service`.
* `key`: the desired translation key. Example: `footer.titles.come_again`.
* `value`: the translation itself. Currently you might face some issues with unescaped characters. Example: `Come again!`.
* `originalLocale`: the locale in which `value` is written. Example: `en-gb`.

## Current TODOs:

* Verify if a translation key already existed and overwrite or discard
* Escape strings when setting translation
* Use same locale notation as i18n

## LICENSE

The MIT License (MIT)

Copyright (c) 2017

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
