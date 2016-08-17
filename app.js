var FlightScrapper = require('./dist/flight-scrapper');
FlightScrapper.run(process.argv.splice(2, process.argv.length)).then(function(res) {
    console.log('Inserted ' + res + ' flights!');
}, function(e) {
    throw Error(e);
});
