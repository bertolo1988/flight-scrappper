let FlightScrappper = require('./dist/flight-scrappper');
let debug = require('debug')('flight-scrappper-app.js');
let Utils = require('./src/utils');

var defaultDateFormat = 'DD-MM-YYYY';
var options = {
    periods: 30,
    interval: 96,
    routes: [{
        from: 'LIS',
        to: 'SHA'
    }, {
        from: 'LIS',
        to: 'MAA'
    }, {
        from: 'LIS',
        to: 'TYO'
    }, {
        from: 'LIS',
        to: 'DPS'
    }, {
        from: 'LIS',
        to: 'MLE'
    }, {
        from: 'LIS',
        to: 'LAD'
    }, {
        from: 'LIS',
        to: 'LON'
    }, {
        from: 'LIS',
        to: 'MIL'
    }, {
        from: 'LIS',
        to: 'PAR'
    }, {
        from: 'LIS',
        to: 'BCN'
    }, {
        from: 'LIS',
        to: 'IST'
    }, {
        from: 'LIS',
        to: 'NYC'
    }, {
        from: 'LIS',
        to: 'BER'
    }],
    currency: 'EUR',
    directFlight: false,
    dateFormat: defaultDateFormat,
    targetDate: Utils.getDefaultDateString(defaultDateFormat),
    database: 'localhost:27017/flight-scrappper',
    collection: 'flight-data',
    timeout: 60000,
    browser: 'chrome'
};

FlightScrappper.run(options).then((value) => {
    debug('Resolved: ' + Utils.prettifyObject(value.length) + ' flights!');
}).catch(function(err) {
    debug('Found an error! ' + err);
});