[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a3b112d983624adea191ba81a9713ba1)](https://www.codacy.com/app/tiagobertolo/flight-scrapper?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=bertolo1988/flight-scrapper&amp;utm_campaign=Badge_Grade)
[![Stories in Ready](https://badge.waffle.io/bertolo1988/flight-scrapper.png?label=ready&title=Ready)](https://waffle.io/bertolo1988/flight-scrapper)


# flight-scrapper

Web scrapper made with nodejs and webdriverjs that gathers flight data and stores it in a mongodb database.


## Requirements

 - [chrome](https://www.google.com/chrome/browser/desktop/index.html)
 - [mongodb](https://www.mongodb.com/)
 - [npm](http://npmjs.org/)
 - [node](http://nodejs.org/)
 - [gulp](http://gulpjs.com/)


## Installing

`$ npm install flight-scrapper`


## Config

Add a config.js file to the project folder with the following format and fields.

	var config = {
	    DATABASE: 'localhost:27017/flight-scrapper',
	    COLLECTION: 'flight-data',
	    DATE_FORMAT: 'DD-MM-YYYY',
	    TIMEOUT: 50000,
	    BROWSER: 'chrome'
	};
	module.exports = config;


## Options

The following options can be defined as an argument of the `FlightScrapper.run()` method.
This can be done by passing an array in the following format: `['option1=abc','options2=abc',...]`.

If an option is not defined, a default value will be used instead.
These are the default values:

	var options = {
		periods: 1, 						//specifies the number of queries that will be made
		interval: 48, 						//number of hours between the queries
		from: 'LIS',						//departure aeroport trigram Ex: PAR, LIS, NYC, TOK, LON, DUB
		to: 'PAR',							//destination aeroport trigram Ex: PAR, LIS, NYC, TOK, LON, DUB
		currency: 'USD', 					//EUR,USD,GBP
		directFlight: 'false',				// 'true' or 'false'
		targetDate: getDefaultDateString()	//wich is new Date() + 2 days
	};

During the start, a new parameter `dates` will be generated. This array will contain dates in string form in the `Config.DATE_FORMAT` format.

This dates are calculated with the following formula `targetDate + options.interval x options.periods ` times.
 
Example: Setting periods to 2, interval to 24 and targetDate to 5/01/2000 will generate an array  such as ['5/01/2000','07/01/2000'].

## Running

First, start your [mongodb](https://www.mongodb.com/) database. You can find more information on how to do this [here](https://docs.mongodb.com/).

To start the flight-scrapper with the default values just type `$ node app.js` or `$ npm start`.

If you want to get feedback in the console please check  [Debugging](#debugging).

If you want to define an option just use `$ node app.js option1=value options2=value`.

## Output

`FlightScrapper.run` will return a promise wich will resolve into the number of inserted documents or into an error.

The resulting data that will be stored has the following fields:

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

It is still possible to run the app with parameters, example: `npm run debug from=POR to=PHI`;

## Contributing

Contributions or pull requests are welcome & appreciated!

Send [me](https://github.com/bertolo1988/) an email if you have questions regarding possible contributions.
