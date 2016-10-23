[![NPM](https://nodei.co/npm/flight-scrappper.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/flight-scrappper/)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e0ff0ec2a3484cd0b823933578987cf4)](https://www.codacy.com/app/tiagobertolo/flight-scrappper?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=bertolo1988/flight-scrappper&amp;utm_campaign=Badge_Grade)
[![Stories in Ready](https://badge.waffle.io/bertolo1988/flight-scrappper.svg?label=ready&title=Ready)](http://waffle.io/bertolo1988/flight-scrappper)
[![dependencies Status](https://david-dm.org/bertolo1988/flight-scrappper/status.svg)](https://david-dm.org/bertolo1988/flight-scrappper)
[![devDependencies Status](https://david-dm.org/bertolo1988/flight-scrappper/dev-status.svg)](https://david-dm.org/bertolo1988/flight-scrappper?type=dev)

# flight-scrappper

Web scraper made with nodejs and selenium-webdriver that gathers flight data and stores it in a mongodb database.


## Requirements

 - [node](http://nodejs.org/)
 - [npm](http://npmjs.org/)
 - [chrome](https://www.google.com/chrome/browser/desktop/index.html)
 - [mongodb](https://www.mongodb.com/)
 - [mocha](https://mochajs.org/)


## Installing

`$ npm install flight-scrappper`


## Options

The following options can be defined as an argument of the `FlightScrappper.run()` method.

This can be done passing an object `{option1:'abc',option2:'abc',...}`.

If an option is not defined, a default value will be used instead.

These are the default values:
	

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
        timeout: 60000,
        browser: 'chrome',
        maximize: false,
        routes: [{
            from: 'LIS',
            to: 'PAR'
        }]
    };

This queried dates are calculated with the following formula `targetDate + options.interval x options.periods ` times.
 
Example: Setting periods to 2, interval to 24 and targetDate to 5/01/2000 will generate an array  such as ['5/01/2000','07/01/2000'].


## Running

First, start your [mongodb](https://www.mongodb.com/) database. You can try `npm run mongo-linux/win/mac` to start your database in an easy way, or do it manually. For more information on what this commands are doing just read the scripts object in the `package.json` file.

If you want to scrap flights, without storing data, you can set database to `'none'`.

To start the flight-scrappper with the default values just type `$ npm start`.

If you want to run with diferent options just add arguments as specified in [Options](#options).

If you want to get feedback in the console please check  [Debugging](#debugging).

## Output

`FlightScrappper.run` will return a promise wich will resolve into the number of inserted documents or into an error.

The output data that will look like this:

    {
        "search" : {
            "from" : "LIS",
            "to" : "MAA",
            "source" : "momondo",
            "queried" : ISODate("2016-10-22T18:09:28.563Z")
        },
        "data" : {
            "duration" : 1355,
            "stops" : 2,
            "price" : {
                "amount" : 415,
                "currency" : "EUR"
            },
            "departure" : {
                "time" : {
                "minute" : 30,
                "hour" : 7,
                    "day" : 28,
                    "month" : 10,
                    "year" : 2016
                },
                "airport" : "LIS"
            },
            "arrival" : {
                "time" : {
                    "minute" : 35,
                    "hour" : 10,
                    "day" : 29,
                    "month" : 10,
                    "year" : 2016
                },
                "airport" : "MAA"
            }
        }
    }

## Tests

`$ npm test`

## Debugging or Verbose

`$ npm run debug` to have console output.

## Contributing

Contributions, requests or pull requests are welcome & appreciated!

Send [me](https://github.com/bertolo1988/) an email if you have questions regarding possible contributions.
