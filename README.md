[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a3b112d983624adea191ba81a9713ba1)](https://www.codacy.com/app/tiagobertolo/flight-scrapper?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=bertolo1988/flight-scrapper&amp;utm_campaign=Badge_Grade)
[![Stories in Ready](https://badge.waffle.io/bertolo1988/flight-scrapper.png?label=ready&title=Ready)](https://waffle.io/bertolo1988/flight-scrapper)
[![Build Status](https://travis-ci.org/bertolo1988/flight-scrapper.svg?branch=master)](https://travis-ci.org/bertolo1988/flight-scrapper)



# flight-scrapper

Web scrapper made with nodejs and webdriverjs that gathers flight data and stores it in a mongodb database.


## Requirements

 - [chrome](https://www.google.com/chrome/browser/desktop/index.html)
 - [mongodb database](https://www.mongodb.com/)
 - [npm](http://npmjs.org)
 - [node](http://nodejs.org/)

## Installing

`$ npm install flight-scrapper`

## Running

First, start your [mongodb](https://www.mongodb.com/) database. You can find more information on how to do this [here](https://docs.mongodb.com/)

To start the flight-scrapper with the default values just type `$ node app.js`.
If you want to define an option just use `$ node app.js option1=value options2=value`.

## Options

If an option is not defined, a default value will be used instead.
The following options are available:

	database     mongodb database to connect to
	collection   collection to be used inside the database
	port         to connecto to the database
	timeout      defines the limit, in seconds, to wait for a web browser query
	periods      specifies the number of queries that will be made
	interval     number of hours between the queries
	from         departure aeroport trigram Ex: PAR, LIS, NYC, TOK, LON, DUB
	to           destination aeroport trigram Ex: PAR, LIS, NYC, TOK, LON, DUB
	targetDate   targetDate + interval specify the date of the first query

---
##### Example 1:
`$ node app.js`
Will use the following default values:
	
	{
		"database":"flight-scrapper",
		"collection":"flight-data",
		"port":"27017",
		"timeout":90,
		"periods":2,
		"interval":48,
		"from":"LIS",
		"to":"PAR",
		"targetDate":"08-07-2016"	
	}

---
##### Example 2:
`$ node app.js targetDate=23-05-2017 from=NYC periods=3`

Will use all default values while overriding targetDate, departure aeroport and periods. 
The data will be stored in the 'flight-scrapper' database, 'flight-data' collection using the '27017' port. The data will represent the available flights between New York ('NYC') and Paris ('PAR') in the following dates 25-05, 27-05, 29-05 of 2017. Note that the first date being queried is targetDate + interval.

## Tests

`$ npm test`

## Contributing

Contributions or pull requests are welcome & appreciated!

Send [me](https://github.com/bertolo1988/) an email if you have questions regarding possible contributions.
