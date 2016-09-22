require('should');
var Moment = require('moment');
var Utils = require('../src/utils');
var Options = require('../src/options');

describe('retrieveFlightDatesArray test', () => {

  var DATE_FORMAT = new Options().options.dateFormat;
  const datesCount = 10;
  const interval = 24;

  it('should generate 3 dates, in days 7, 9, 11-09-2015 from a moment', (done) => {
    let moment = new Moment('05-09-2015', DATE_FORMAT);
    let dates = Utils.retrieveFlightDatesArray(moment, DATE_FORMAT, 3, interval * 2);
    (dates[0]).should.be.equal('05-09-2015');
    (dates[1]).should.be.equal('07-09-2015');
    (dates[2]).should.be.equal('09-09-2015');
    done();
  });

  it('should generate ' + datesCount + ' dates from a string', (done) => {
    let todayDate = new Moment().format(DATE_FORMAT);
    let dates = Utils.retrieveFlightDatesArray(todayDate, DATE_FORMAT, datesCount, interval);
    (dates.length).should.be.exactly(datesCount);
    let todayMoment = new Moment().add((datesCount - 1) * interval, 'hours').format(DATE_FORMAT);
    todayMoment.should.be.equal(dates[(datesCount - 1)]);
    done();
  });

});