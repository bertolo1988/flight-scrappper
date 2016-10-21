require('should');
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

});
