const FlightScrapper = require('./dist/flight-scrapper');

FlightScrapper.run(process.argv.splice(2, process.argv.length));