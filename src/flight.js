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

module.exports = Flight;