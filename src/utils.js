var Config = require('../config');
var Moment = require('moment');

module.exports = {

  printObjectProperties(obj) {
    for (let propName in obj) {
      if ({}.hasOwnProperty.call(obj, propName)) {
        this.printText(propName, obj[propName]);
      }
    }
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