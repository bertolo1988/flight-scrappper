class Flight {
	constructor(date, airline, price, currency, departure, duration, stops, from, to, queried) {
		this.from = from;
		this.to = to;
		this.airline = airline;
		this.date = date;
		this.departure = departure;
		this.duration = duration;
		this.stops = stops;
		this.queried = queried;
		this.price = price;
		this.currency = currency;
	}
}
module.exports = Flight;