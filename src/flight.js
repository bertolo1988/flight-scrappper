class Flight {
    constructor(from, to, source, airline, stops, flightTime, duration, queried, amount, currency) {
        this.from = from;
        this.to = to;
        this.source = source;
        this.airline = airline;
        this.stops = stops;
        this.time = {
            flightTime,
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
