var Moment = require('moment');

module.exports = {

    getTodayDateString(dateFormat) {
        return new Moment(new Date().toISOString()).format(dateFormat);
    },

    getDefaultDateString(dateFormat) {
        return new Moment(new Date().toISOString()).add(2, 'days').format(dateFormat);
    },

    prettifyObject(obj) {
        return JSON.stringify(obj, null, 2);
    },

    flattenArray(data) {
        var result = [];
        for (let doc of data) {
            for (let flight of doc) {
                result.push(flight);
            }
        }
        return result;
    },

    retrieveFlightDatesArray(fromDate, dateFormat, periods, interval) {
        let result = [];
        let targetDate = new Moment(fromDate, dateFormat);
        for (let i = 0; i < periods; i++) {
            result.push(targetDate.format(dateFormat));
            targetDate = targetDate.add(interval, 'hours');
        }
        return result;
    }

};
