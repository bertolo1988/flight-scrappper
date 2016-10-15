var Utils = require('../src/utils');

function getDefaultOptions() {
    let defaultDateFormat = 'DD-MM-YYYY';
    var defaultOptions = {
        periods: 1,
        interval: 48,
        routes: [{
            from: 'LIS',
            to: 'PAR'
        }],
        currency: 'EUR',
        directFlight: 'false',
        dateFormat: defaultDateFormat,
        targetDate: Utils.getDefaultDateString(defaultDateFormat),
        database: 'localhost:27017/flight-scrappper',
        collection: 'flight-data',
        timeout: 50000,
        browser: 'chrome'
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
    var options = getDefaultOptions();
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
