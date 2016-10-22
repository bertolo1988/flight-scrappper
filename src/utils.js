var Moment = require('moment');
var FlightTime = require('../src/flight-time');

module.exports = {

    getDefaultDateString(dateFormat) {
        return new Moment(new Date().toISOString()).add(2, 'days').format(dateFormat);
    },

    prettifyObject(obj) {
        return JSON.stringify(obj, null, 4);
    },

    isNumeric(str) {
        return /^\d+$/.test(str);
    },

    retrieveDigit(input) {
        return parseInt(input.replace(/[^\d\.\-]/g, ''));
    },

    momentToFlightTime(myMoment) {
        let data = {
            minute: parseInt(myMoment.format('mm')),
            hour: parseInt(myMoment.format('HH')),
            day: parseInt(myMoment.format('DD')),
            month: parseInt(myMoment.format('MM')),
            year: parseInt(myMoment.format('YYYY'))
        };
        return new FlightTime(data);
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