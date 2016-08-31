let FlightScrappper = require('./dist/flight-scrappper');
let debug = require('debug')('flight-scrappper-app.js');
let Utils = require('./src/utils');

var defaultDateFormat = 'DD-MM-YYYY';
var options = {
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
	database: 'localhost:27017/flight-scrappper',
	collection: 'flight-data',
	timeout: 50000,
	browser: 'chrome'
};

FlightScrappper.run(options).then((value) => {
	debug('Resolved: ' + Utils.prettifyObject(value));
}, (err) => {
	debug('Rejected: ' + err);
});