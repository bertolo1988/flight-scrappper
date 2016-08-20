const FlightScrapper = require('./dist/flight-scrapper');
const debug = require('debug')('app.js');

FlightScrapper.run(process.argv.splice(2, process.argv.length)).then((value) => {
	debug('Resolved: ' + value);
}, (err) => {
	debug('Rejected: ' + err);
});