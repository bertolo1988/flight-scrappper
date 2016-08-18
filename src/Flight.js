class Flight {
	constructor(from, to, airline, stops, date, departure, duration, queried, amount, currency) {
		this.from = from;
		this.to = to;
		this.airline = airline;
		this.stops = stops;
		this.time = {
			date,
			departure,
			duration,
			queried
		};
		this.price = {
			amount,
			currency
		};
	}
}
module.exports = Flight;