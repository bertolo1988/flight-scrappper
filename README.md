# flight-scrappper

A Web scraper made with nodejs and selenium-webdriver that gathers flight data and stores it in a mongodb database.


[![NPM Version][npm-image]][npm-url]
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e0ff0ec2a3484cd0b823933578987cf4)](https://www.codacy.com/app/tiagobertolo/flight-scrappper?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=bertolo1988/flight-scrappper&amp;utm_campaign=Badge_Grade)
[![dependencies Status](https://david-dm.org/bertolo1988/flight-scrappper/status.svg)](https://david-dm.org/bertolo1988/flight-scrappper)
[![devDependencies Status](https://david-dm.org/bertolo1988/flight-scrappper/dev-status.svg)](https://david-dm.org/bertolo1988/flight-scrappper?type=dev)
[![MIT License][license-image]][license-url]


```js
let FlightScrappper = require('flight-scrappper');

FlightScrappper.run().then((flights) => {
    console.log(flights);
}).catch(function(err) {
    console.log('Found an error! ' + err);
});
```


## Requirements

 - [chrome](https://www.google.com/chrome/browser/desktop/index.html)
 - [mongodb](https://www.mongodb.com/)


## Installation

```bash
$ npm install --save flight-scrappper
```


## Options

The following options can be defined as an argument of the `FlightScrappper.run()` method.

This can be done passing an object `{option1:'abc',option2:'abc',...}`.

If an option is not defined, a default value will be used instead.

These are the default values:
	
```js
const defaultDateFormat = 'DD-MM-YYYY';
let defaultOptions = {
    periods: 1,
    interval: 48,
    currency: 'EUR',
    directFlight: false,
    dateFormat: defaultDateFormat,
    targetDate: Utils.getDefaultDateString(defaultDateFormat),
    database: 'localhost:27017/flight-scrappper',
    collection: 'flight-data',
    timeout: 50000,
    browser: 'chrome',
    chromedriverArgs: [],
    maximize: false,
    retries: 1,
    routes: [{
        from: 'LIS',
        to: 'PAR'
    }]
};
```

These queried dates are calculated with the following formula `targetDate + options.interval x options.periods ` times.
 
Example: Setting periods to 2, interval to 24 and targetDate to 5/01/2000 will generate an array  such as ['5/01/2000','07/01/2000'].


## Running

First, start your [mongodb](https://www.mongodb.com/) database. You can try `npm run mongo-linux/win/mac` to start your database in an easy way, or do it manually. For more information on what these commands are doing, just read the scripts object in the `package.json` file.

If you want to scrap flights, without storing data, you can set database to `'none'`.

To start the flight-scrappper with the default values just type `$ npm start`.

If you want to run with different options just add arguments as specified in [Options](#options).

If you want to get feedback in the console please check  [Debugging](#debugging).


## Output

`FlightScrappper.run` will return a promise which will resolve into the number of inserted documents or into an error.

The output data that will look like this:

```js
"search" : {
    "from" : "LIS",
    "to" : "AKL",
    "source" : "momondo",
    "queried" : ISODate("2016-10-23T12:09:21.566Z")
},
"data" : {
    "duration" : 2080,
    "stops" : 2,
    "flightClass" : 0,
    "airline": ["TAP","Ryanair"],
    "price" : {
        "amount" : 778,
        "currency" : "EUR"
    },
    "departure" : {
        "time" : {
            "minute" : 15,
            "hour" : 14,
            "day" : 25,
            "month" : 10,
            "year" : 2016
        },
        "airport" : "LIS"
    },
    "arrival" : {
        "time" : {
            "minute" : 55,
            "hour" : 12,
            "day" : 27,
            "month" : 10,
            "year" : 2016
        },
        "airport" : "AKL"
    }
}
```


## Tests

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```


## Debugging or Verbose

`$ npm run debug` to have console output.


## Contributing

Contributions, requests or pull requests are welcome & appreciated!

Send your pull requests to the developing branch please!

Send [me](https://github.com/bertolo1988/) an email if you have questions regarding possible contributions.


## License

  [MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/flight-scrappper.svg
[npm-url]: https://www.npmjs.com/package/flight-scrappper
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE