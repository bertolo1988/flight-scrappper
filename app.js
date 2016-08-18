const FlightScrapper = require('./dist/flight-scrapper');

FlightScrapper.run(process.argv.splice(2, process.argv.length)).then((res) => {
	console.log('Inserted ' + res + ' flights!');
}, (err) => {
	console.log(err);
});