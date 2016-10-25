class Flight {
    constructor(data) {
        this.search = {
            from: data.from,
            to: data.to,
            source: data.source,
            queried: data.queried
        };
        this.data = {
            duration: data.duration,
            stops: data.stops,
            flightClass: data.flightClass,
            airline: data.airline,
            price: {
                amount: data.amount,
                currency: data.currency
            },
            departure: {
                time: data.departureTime,
                airport: data.departureAirport
            },
            arrival: {
                time: data.arrivalTime,
                airport: data.arrivalAirport
            }
        };
    }
}

var FlightClass = {
    'ECONOMY': 0,
    'PREMIUM': 1,
    'BUSINESS': 2,
    'FIRST': 3
};

class FlightTime {
    constructor(data) {
        this.minute = data.minute;
        this.hour = data.hour;
        this.day = data.day;
        this.month = data.month;
        this.year = data.year;
    }
}

module.exports = {
    Flight,
    FlightTime,
    FlightClass
};
