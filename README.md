[![NPM](https://nodei.co/npm/flight-scrapper.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/flight-scrapper/)

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a3b112d983624adea191ba81a9713ba1)](https://www.codacy.com/app/tiagobertolo/flight-scrapper?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=bertolo1988/flight-scrapper&amp;utm_campaign=Badge_Grade)
[![npm version](https://badge.fury.io/js/flight-scrapper.svg)](https://badge.fury.io/js/flight-scrapper)
[![Stories in Ready](https://badge.waffle.io/bertolo1988/flight-scrapper.svg?label=ready&title=Ready)](http://waffle.io/bertolo1988/flight-scrapper)
[![dependencies Status](https://david-dm.org/bertolo1988/flight-scrapper/status.svg)](https://david-dm.org/bertolo1988/flight-scrapper)
[![devDependencies Status](https://david-dm.org/bertolo1988/flight-scrapper/dev-status.svg)](https://david-dm.org/bertolo1988/flight-scrapper?type=dev)

# flight-scrapper

Web scrapper made with nodejs and webdriverjs that gathers flight data and stores it in a mongodb database.


## Requirements

 - [node](http://nodejs.org/)
 - [npm](http://npmjs.org/)
 - [chrome](https://www.google.com/chrome/browser/desktop/index.html)
 - [mongodb](https://www.mongodb.com/)


## Installing

`$ npm install flight-scrapper`


## Options

The following options can be defined as an argument of the `FlightScrapper.run()` method.

This can be done passing an object `{option1:'abc',option2:'abc',...}`.

If an option is not defined, a default value will be used instead.

These are the default values:
	
	let defaultDateFormat = 'DD-MM-YYYY';
	var defaultOptions = {
		periods: 1,
		interval: 48,
		routes: [{
			from: 'LIS',
			to: 'PAR'
		}],
		currency: 'USD',
		directFlight: 'false',
		dateFormat: defaultDateFormat,
		targetDate: Utils.getDefaultDateString(defaultDateFormat),
		database: 'localhost:27017/flight-scrapper',
		collection: 'flight-data',
		timeout: 50000,
		browser: 'chrome'
	};

During the start, a new parameter `dates` will be generated. This array will contain dates in string form in the `options.dateFormat` format.

This dates are calculated with the following formula `targetDate + options.interval x options.periods ` times.
 
Example: Setting periods to 2, interval to 24 and targetDate to 5/01/2000 will generate an array  such as ['5/01/2000','07/01/2000'].

## Running

First, start your [mongodb](https://www.mongodb.com/) database. You can find more information on how to do this [here](https://docs.mongodb.com/).

If you installed mongodb in the default directory you can run `$ npm run mongo-win` or `$ npm run mongo-mac` to run a database that will use a folder named `mongo-db` in the current directory.

To start the flight-scrapper with the default values just type `$ npm start`.

If you want to run with diferent options just add arguments as specified in [Options](#options).

If you want to get feedback in the console please check  [Debugging](#debugging).

## Output

`FlightScrapper.run` will return a promise wich will resolve into the number of inserted documents or into an error.

The resulting data that will be stored in the database has the following fields:

	{
		_id, 		
		from,
		to,	
		airline,
		stops,
		time: {
			date,
			departure,
			duration,
			queried
		},
		price:{
			amount,
			currency
		}
	}

## Tests

`$ npm test`

## Debugging

`$ npm run debug` to have console output.

It is still possible to run the app with parameters, example: `$ npm run debug from=POR to=PHI`;

## Contributing

Contributions, requests or pull requests are welcome & appreciated!

Send [me](https://github.com/bertolo1988/) an email if you have questions regarding possible contributions.
