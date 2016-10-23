var should = require('should');
var Moment = require('moment');
var Utils = require('../src/utils');
var Options = require('../src/options');

describe('retrieveFlightDatesArray test', () => {

    var DATE_FORMAT = new Options().options.dateFormat;
    const datesCount = 10;
    const interval = 24;

    it('should generate 3 dates, in days 5, 6, 7, 08-09-2015 from a moment', (done) => {
        let moment = new Moment('05-09-2015', DATE_FORMAT);
        let dates = Utils.retrieveFlightMoments(moment, datesCount, interval);
        (dates[0].format(DATE_FORMAT)).should.be.equal('05-09-2015');
        (dates[1].format(DATE_FORMAT)).should.be.equal('06-09-2015');
        (dates[2].format(DATE_FORMAT)).should.be.equal('07-09-2015');
        (dates[datesCount - 1].format(DATE_FORMAT)).should.be.equal('14-09-2015');
        done();
    });

    it('should generate ' + datesCount + ' dates from a string', (done) => {
        let dates = Utils.retrieveFlightMoments(new Moment(), datesCount, interval);
        (dates.length).should.be.exactly(datesCount);
        let todayMoment = new Moment().add((datesCount - 1) * interval, 'hours').format(DATE_FORMAT);
        todayMoment.should.be.equal(dates[(datesCount - 1)].format(DATE_FORMAT));
        done();
    });

    it('should tell if string', (done) => {
        Utils.isNumeric('dd').should.be.false();
        Utils.isNumeric('1D').should.be.false();
        Utils.isNumeric('1').should.be.true();
        done();
    });

    it('should retrieve digits', (done) => {
        Utils.retrieveDigit('+1').should.be.exactly(1);
        Utils.retrieveDigit('1,300').should.be.exactly(1300);
        Utils.retrieveDigit('-14.00').should.be.exactly(1400);
        Utils.retrieveDigit('+15.0$').should.be.exactly(150);
        Utils.retrieveDigit('-1').should.be.exactly(1);
        Utils.retrieveDigit('5').should.be.exactly(5);
        done();
    });

    it('should convert moment to flightTime', (done) => {
        let flightTime = Utils.momentToFlightTime(new Moment());
        should.exist(flightTime);
        should.exist(flightTime.minute);
        should.exist(flightTime.hour);
        should.exist(flightTime.day);
        should.exist(flightTime.month);
        should.exist(flightTime.year);
        done();
    });

});