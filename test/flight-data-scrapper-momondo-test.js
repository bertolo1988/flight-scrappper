var should = require('should');
var FlightScrapper = require('../dist/flight-scrapper');
var supertest = require('supertest');
var Config = require('../config');
var request = supertest('https://www.momondo.com');

describe('FlightScrapper tests', function() {

    this.timeout(Config.TIMEOUT);

    it('should see data in the database', function(done) {
        FlightScrapper.run();
    });

});
