var FlightScrapper = require('../dist/flight-scrapper');
var Persistency = require('../src/persistency-module');
var Config = require('../config');
var should = require('should');

describe('flightScrapper test', function() {
  this.timeout(Config.TIMEOUT);

  it('should retrieve and delete results with default options', () => {
    let ids;
    let flightScPromise = FlightScrapper.run();
    let persistencyPromise = flightScPromise.then((idsArray) => {
      should.exist(idsArray);
      (idsArray.length).should.be.above(0);
      ids = idsArray;
      return Persistency.removeFlights(idsArray);
    });
    return persistencyPromise.then((deleted) => {
      (deleted).should.be.exactly(ids.length).which.is.a.Number();
    });
  });
  it('should resolve into [] if no flights are retrieved or persisted', () => {
    let flightScPromise = FlightScrapper.run(['from=POR', 'to=PHI']);
    return flightScPromise.then((inserted) => {
      (inserted.length).should.be.exactly(0).which.is.a.Number();
    });
  });
});