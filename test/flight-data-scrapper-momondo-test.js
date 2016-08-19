var FlightScrapper = require('../dist/flight-scrapper');
var Persistency = require('../src/persistency-module');
var Config = require('../config');
require('should');

describe('flightScrapper test', function() {
  this.timeout(Config.TIMEOUT);

  it('should retrieve and delete results with default options', (done) => {
    FlightScrapper.run().then((ids) => {
      Persistency.removeFlightsById(ids).then((deleted) => {
        (deleted).should.be.exactly(ids.length).which.is.a.Number();
        done();
      }).catch((err) => done(err));
    }).catch((err) => done(err));
  });

  it('should get "No results" error', (done) => {
    FlightScrapper.run(['from=POR', 'to=PHI']).then({}, (inserted) => {
      (inserted).should.be.exactly(0).which.is.a.Number();
      done();
    }).catch((err) => done(err));
  });
});