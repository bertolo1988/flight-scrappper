var Utils = require('../src/utils');

function getDefaultOptions() {
	let defaultDateFormat = 'DD-MM-YYYY';
	var defaultOptions = {
		periods: 1,
		interval: 48,
		from: 'LIS',
		to: 'PAR',
		currency: 'USD',
		directFlight: 'false',
		dateFormat: defaultDateFormat,
		targetDate: Utils.getDefaultDateString(defaultDateFormat),
		database: 'localhost:27017/flight-scrapper',
		collection: 'flight-data',
		timeout: 50000,
		browser: 'chrome'
	};
	return defaultOptions;
}

function retrieveOptionsFromArray(options, args) {
	if (args != null) {
		for (let argument of args) {
			let auxiliar = argument.split('=');
			let argumentName = auxiliar[0];
			let argumentValue = auxiliar[1];
			if (argumentName in options) {
				options[argumentName] = argumentValue;
			} else {
				throw new Error('Invalid args error message!');
			}
		}
	}
	return options;
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
		if (input instanceof Array) {
			options = retrieveOptionsFromArray(options, input);
		} else {
			options = retrieveOptionsFromObject(options, input);
		}
	}
	return options;
}


class Options {

	constructor(input) {
		this.options = retrieveOptions(input);
	}

}

module.exports = Options;