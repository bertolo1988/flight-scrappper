var should = require('should');
var Moment = require('moment');
var Utils = require('../src/utils');
var Config = require('../config');

describe('Utils tests', function() {

    it('should generate 3 dates, in days 7, 9, 11-09-2015', function(done) {
        let moment = new Moment('05-09-2015', Config.DATE_FORMAT);
        let dates = Utils.retrieveFlightDatesArray(moment, 3, 48);
        (dates[0]).should.be.equal('07-09-2015');
        (dates[1]).should.be.equal('09-09-2015');
        (dates[2]).should.be.equal('11-09-2015');
        done();
    });

    it('should generate 45 dates from a ISO string', function(done) {
        var todayDate = new Date().toISOString();
        var dates = Utils.retrieveFlightDatesArray(todayDate, 45, 24);
        (dates.length).should.be.exactly(45);
        var todayMoment = new Moment().add(45, 'days').format(Config.DATE_FORMAT);
        todayMoment.should.be.equal(dates[44]);
        done();
    });

});
