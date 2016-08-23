var FlightScrapper = require('../dist/flight-scrapper');
var Persistency = require('../src/persistency-module');
var Options = require('../src/options');
var should = require('should');

describe('flightScrapper test', function() {

  var options = new Options().options;
  this.timeout(options.timeout);

  it('should retrieve and delete results with default options', () => {
    let ids;
    let flightScPromise = FlightScrapper.run();
    let persistencyPromise = flightScPromise.then((idsArray) => {
      should.exist(idsArray);
      (idsArray.length).should.be.above(0);
      ids = idsArray;
      return Persistency.removeFlights(options.database, options.collection, idsArray);
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