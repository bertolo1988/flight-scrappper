var FlightScrappper = require('../dist/flight-scrappper');
var Persistency = require('../src/persistency-module');
var Options = require('../src/options');
var should = require('should');

describe('flightScrappper test', function() {

    var options = new Options().options;
    this.timeout(options.timeout);

    function checkNumber(myNumber, mustBe) {
        return (myNumber).should.be.exactly(mustBe).which.is.a.Number();
    }

    it('should retrieve and delete results with default options', () => {
        let ids;
        let flightScPromise = FlightScrappper.run();
        let persistencyPromise = flightScPromise.then((idsArray) => {
            should.exist(idsArray);
            (idsArray.length).should.be.above(0);
            ids = idsArray;
            return Persistency.removeFlights(options.database, options.collection, idsArray);
        });
        return persistencyPromise.then((deleted) => {
            return checkNumber(deleted, ids.length);
        });
    });

    it('should resolve into [] if no flights are retrieved or persisted', () => {
        let flightScPromise = FlightScrappper.run({
            routes: [{
                from: 'POR',
                to: 'PHI'
            }]
        });
        return flightScPromise.then((inserted) => {
            return checkNumber(inserted.length, 0);
        });
    });

});
