let FlightScrapper = require('./dist/flight-scrapper');
let debug = require('debug')('app.js');
let Utils = require('./src/utils');

FlightScrapper.run(process.argv.splice(2, process.argv.length)).then((value) => {
	debug('Resolved: ' + Utils.prettifyObject(value));
}, (err) => {
	debug('Rejected: ' + err);
});