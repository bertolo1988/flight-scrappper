var FlightScrapper = require('../dist/flight-scrapper');
var Persistency = require('../src/persistency-module');
var Config = require('../config');
require('should');

describe('FlightScrapper tests', function() {
  this.timeout(Config.TIMEOUT);

  it('should retrieve and delete results with default options', (done) => {
    FlightScrapper.run(['periods=2']).then((resp) => {
      Persistency.removeFlightsById(resp).then((deleted) => {
        (deleted).should.be.exactly(resp.length).which.is.a.Number();
        done();
      });
    }, (err) => {
      err.should.not.exist();
      done();
    });
  });

  it('should get "No results" error', (done) => {
    FlightScrapper.run(['from=POR', 'to=PHI']).then({}, (inserted) => {
      (inserted).should.be.exactly(0).which.is.a.Number();
      done();
    });
  });
});