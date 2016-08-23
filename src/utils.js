var Moment = require('moment');

module.exports = {
  getDefaultDateString(dateFormat) {
    return new Moment(new Date().toISOString()).add(2, 'days').format(dateFormat);
  },

  prettifyObject(obj) {
    return JSON.stringify(obj, null, 2);
  },

  retrieveFlightDatesArray(fromDate, dateFormat, periods, interval) {
    let result = [];
    let targetDate = new Moment(fromDate, dateFormat);
    result.push(targetDate.format(dateFormat));
    for (let i = 1; i < periods; i++) {
      targetDate = targetDate.add(interval, 'hours');
      result.push(targetDate.format(dateFormat));
    }
    return result;
  }
};