var Config = require('../config');
var Moment = require('moment');

module.exports = {

  getDefaultDateString() {
    return new Moment(new Date().toISOString()).add(2, 'days').format(Config.DATE_FORMAT);
  },

  retrieveFlightDatesArray(fromDate, periods, interval) {
    let result = [];
    let targetDate = new Moment(fromDate, Config.DATE_FORMAT);
    result.push(targetDate.format(Config.DATE_FORMAT));
    for (let i = 1; i < periods; i++) {
      targetDate = targetDate.add(interval, 'hours');
      result.push(targetDate.format(Config.DATE_FORMAT));
    }
    return result;
  }

};