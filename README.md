[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a3b112d983624adea191ba81a9713ba1)](https://www.codacy.com/app/tiagobertolo/flight-scrapper?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=bertolo1988/flight-scrapper&amp;utm_campaign=Badge_Grade)
[![Stories in Ready](https://badge.waffle.io/bertolo1988/flight-scrapper.png?label=ready&title=Ready)](https://waffle.io/bertolo1988/flight-scrapper)

# flight-scrapper

Web scrapper made with nodejs and webdriverjs that gathers flight data and stores it in a mongodb database.

### Installing
You need [node](http://nodejs.org/) and [npm](http://npmjs.org). And then:

`npm install`

## Help

You will find a brief explanation about the flags available using:

`npm app.js -h`

## Running

Run the application using `node app -timeout -periods -interval -from -to -targetDate`

    - timeout       seconds to wait for browser queries.
    - periods       times that the program will search for data.
    - interval      hours in between data searches.
    - fom           trigram representing the aeroport Ex:'LIS', 'PAR', 'NYC, 'JKT'.
    - to            destination trigram.
    - targetDate    targetDate + interval will be the first date in wich the first search will be made.
    
Example:
`node app.js 50 2 48 LIS PAR 07/07/2005`

Will result in 2 queries made 09/07/2005, 11/07/2005 in trips from Lisbon to Paris using a 50 second timeout.

### Tests

//TODO

### Contributing

Contributions, pull requests are welcome & appreciated!

Send [me](https://github.com/bertolo1988/) an email if you have questions regarding possible contributions.
