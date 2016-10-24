var Utils = require('../src/utils');

function getDefaultOptions() {
    const defaultDateFormat = 'DD-MM-YYYY';
    let defaultOptions = {
        periods: 1,
        interval: 48,
        currency: 'EUR',
        directFlight: false,
        dateFormat: defaultDateFormat,
        targetDate: Utils.getDefaultDateString(defaultDateFormat),
        database: 'localhost:27017/flight-scrappper',
        collection: 'flight-data',
        timeout: 60000,
        browser: 'chrome',
        chromedriverArgs: [],
        maximize: false,
        routes: [{
            from: 'LIS',
            to: 'PAR'
        }]
    };
    return defaultOptions;
}

function retrieveOptionsFromObject(options, obj) {
    if (obj != null) {
        for (let property in obj) {
            if (obj.hasOwnProperty(property)) {
                options[property] = obj[property];
            }
        }
    }
    return options;
}

function retrieveOptions(input) {
    let options = getDefaultOptions();
    if (input != null) {
        options = retrieveOptionsFromObject(options, input);
    }
    return options;
}

class Options {

    constructor(input) {
        this.options = retrieveOptions(input);
    }

}

module.exports = Options;