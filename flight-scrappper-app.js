let FlightScrappper = require('./dist/flight-scrappper');
let debug = require('debug')('flight-scrappper-app.js');
let Utils = require('./src/utils');

let options = {
    periods: 3,
    interval: 96,
    //currency: 'EUR',
    //directFlight: false,
    //dateFormat: 'DD-MM-YYYY',
    //targetDate: Utils.getDefaultDateString('DD-MM-YYYY'),
    //database: 'localhost:27017/flight-scrappper',
    //collection: 'flight-data',
    //timeout: 60000,
    //browser: 'chrome',
    //chromedriverArgs: ['--verbose', '--log-path=chromedriver.log'],
    //maximize: false
    routes: [{
        from: 'MAD',
        to: 'LON'
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
    }]
};

FlightScrappper.run(options).then((value) => {
    debug('Resolved: ' + Utils.prettifyObject(value.length) + ' flights!');
}).catch(function(err) {
    debug('Found an error! ' + err);
});