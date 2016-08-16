var should = require('should');
var FlightDataScrapper = require('../src/data-scrapper');
var supertest = require('supertest');
var request = supertest('https://www.momondo.com');

describe('FlightScrapper tests', function() {

    it('should get a 200 response from Momondo', function(done) {
        request
            .get('/')
            .expect(200)
            .expect('content-type', 'text/html; charset=utf-8')
            .end(done);
        done();
    });

    it('should see data in the database', function(done) {
        done();
    });

});
