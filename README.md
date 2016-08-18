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
	    TIMEOUT: 40000,
	    VERBOSE: true,
	    BROWSER: 'chrome'
	};
	module.exports = config;


## Options

The following options can be defined as an argument of the `FlightScrapper.run()` method.
This can be done by passing an array in the following format: `['option1=abc','options2=abc',...]`.

If an option is not defined, a default value will be used instead.
These are the default values:

	var options = {
		periods: 1, 		//specifies the number of queries that will be made
		interval: 48, 		//number of hours between the queries
		from: 'LIS',		//departure aeroport trigram Ex: PAR, LIS, NYC, TOK, LON, DUB
		to: 'PAR',			//destination aeroport trigram Ex: PAR, LIS, NYC, TOK, LON, DUB
		currency: 'USD', 	//EUR,USD,GBP
		targetDate: new Moment(new Date().toISOString()) //targetDate + interval specify the date of the first query
	};

During the start, a new parameter `dates` will be generated and added to the options object. This array will contain dates in string form in the `Config.DATE_FORMAT` format.

 This dates are calculated with the followin formula `targetDate+options.interval + (hours x options.periods)` times.
 
Example: Setting periods to 2, interval to 24 and targetDate to 5/01/2000 will generate an array  such as ['7/01/2000','09/01/2000'].

## Running

First, start your [mongodb](https://www.mongodb.com/) database. You can find more information on how to do this [here](https://docs.mongodb.com/).

To start the flight-scrapper with the default values just type `$ node app.js`.
If you want to define an option just use `$ node app.js option1=value options2=value`.

`FlightScrapper.run` will return a promise wich will resolve into the number of inserted documents or into an error.

##### Example 1:
`$ node app.js`
Will use the following default values:
	
	{
  		"periods": 1,
  		"interval": 48,
  		"from": "LIS",
  		"to": "PAR",
  		"currency": "USD",
  		"targetDate": "18-08-2016",
  	}

##### Example 2:
`$ node app.js targetDate=23-05-2017 from=NYC periods=3`

Will use all default values while overriding targetDate, departure aeroport and periods. 
The data will represent the available flights between New York ('NYC') and Paris ('PAR') in the following dates 25-05, 27-05, 29-05 of 2017. Note that the first date being queried is targetDate + interval.

## Output

The resulting data that will have the following fields:

	{
		_id, 		
		from,
		to,	
		airline,
		date,
		departure,
		duration,
		queried,
		price,
		currency
	}

## Tests

`$ npm test`

## Contributing

Contributions or pull requests are welcome & appreciated!

Send [me](https://github.com/bertolo1988/) an email if you have questions regarding possible contributions.
