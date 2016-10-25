var Utils = require('../src/utils');
var Flight = require('../src/flight').Flight;
var FlightClass = require('../src/flight').FlightClass;
var Moment = require('moment');

function momondoFlightBuilder() {

	function retrieveFlightMoment(date, dateFormat, hourMinute, daysLater) {
		let myMoment = new Moment(date);
		let hourMinuteSplitted = hourMinute.split(':');
		myMoment.hour(parseInt(hourMinuteSplitted[0]));
		myMoment.minute(parseInt(hourMinuteSplitted[1]));
		myMoment.add(parseInt(daysLater), 'days');
		return Utils.momentToFlightTime(myMoment);
	}

	function getFlightClass(fClass) {
		switch (fClass) {
			case 'Premium economy':
				return FlightClass.PREMIUM;
			case 'Business class':
				return FlightClass.BUSINESS;
			case 'First class':
				return FlightClass.FIRST;
			default:
				return FlightClass.ECONOMY;
		}
	}

	function getFlightStops(value) {
		if (Utils.isNumeric(value[0])) {
			return parseInt(value[0]);
		} else {
			return 0;
		}
	}

	function parseDuration(duration) {
		let durationMinutes = 0;
		let splittedDuration = duration.split(' ');
		for (let unit of splittedDuration) {
			switch (unit[unit.length - 1]) {
				case 'h':
					durationMinutes += Utils.retrieveDigit(unit) * 60;
					break;
				case 'm':
					durationMinutes += Utils.retrieveDigit(unit);
					break;
				default:
					durationMinutes += Utils.retrieveDigit(unit);
					break;
			}
		}
		return durationMinutes;
	}

	function buildFlight(cursor, args, date, dateFormat, from, to) {
		return new Flight({
			from,
			to,
			source: 'momondo',
			airline: args[cursor],
			queried: new Date(),
			amount: Utils.retrieveDigit(args[cursor + 1]),
			currency: args[cursor + 2],
			departureTime: retrieveFlightMoment(date, dateFormat, args[cursor + 3], 0),
			arrivalTime: retrieveFlightMoment(date, dateFormat, args[cursor + 4], args[cursor + 5]),
			departureAirport: args[cursor + 6],
			arrivalAirport: args[cursor + 7],
			duration: parseDuration(args[cursor + 8]),
			stops: getFlightStops(args[cursor + 9]),
			flightClass: getFlightClass(args[cursor + 10])
		});
	}

	return {
		buildFlight
	};
}

module.exports = momondoFlightBuilder();