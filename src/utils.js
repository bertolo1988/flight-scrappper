var Moment = require('moment');
const util = require('util');
var FlightTime = require('../src/flight').FlightTime;

module.exports = {

    getDefaultDateString(dateFormat) {
        return new Moment(new Date().toISOString()).add(2, 'days').format(dateFormat);
    },

    getTodayDateString(dateFormat) {
        return new Moment(new Date().toISOString()).format(dateFormat);
    },

    prettifyObject(obj) {
        return util.inspect(obj, {
            depth: null,
            colors: true,
            breakLength: 90
        });
    },

    isNumeric(str) {
        return /^\d+$/.test(str);
    },

    retrieveDigit(input) {
        return parseInt(input.replace(/\D/g, ''));
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