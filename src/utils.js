var Config = require('../config');
var Moment = require('moment');

module.exports = {

    printText(text) {
        if (Config.VERBOSE) {
            console.log(text);
        }
    },

    printObjectProperties(obj) {
        for (var propName in obj) {
            printText(propName, obj[propName]);
        }
    },

    retrieveFlightDatesArray(fromDate, periods, interval) {
        var result = [];
        var targetDate = new Moment(fromDate, Config.DATE_FORMAT);
        for (var i = 0; i < periods; i++) {
            targetDate = targetDate.add(interval, 'hours');
            result.push(targetDate.format(Config.DATE_FORMAT));
        }
        return result;
    }

};
