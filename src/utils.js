var Moment = require('moment');

module.exports = {

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

    retrieveFlightMoments(targetMoment, periods, interval) {
        let result = [];
        for (let i = 0; i < periods; i++) {
            result.push(new Moment(targetMoment));
            targetMoment = targetMoment.add(interval, 'hours');
        }
        return result;
    }

};