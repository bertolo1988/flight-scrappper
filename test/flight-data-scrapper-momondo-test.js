var should = require('should');
var FlightScrapper = require('../dist/flight-scrapper');
var supertest = require('supertest');
var Config = require('../config');
var request = supertest('https://www.momondo.com');

describe('FlightScrapper tests', function() {

    this.timeout(Config.TIMEOUT);

    it('should retrieve 15 results', function(done) {
        FlightScrapper.run().then(function(resp) {
            resp.should.be.exactly(15);
            done();
        });
    });

    it('should get "No results" error', function(done) {
        FlightScrapper.run(["to=PHI"]).then({}, function(err) {
            (err instanceof Error).should.be.true();
            done();
        });
    });

});
