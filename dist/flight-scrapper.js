var MomondoScrapper = require('../src/momondo-scrapper');
var Persistency = require('../src/persistency-module');
var Utils = require('../src/utils');
const debug = require('debug')('fligth-scrapper');

function flightScrapper() {

  function retrieveScrapperOptionsFromArgs(args) {
    var options = {
      periods: 1,
      interval: 48,
      from: 'LIS',
      to: 'PAR',
      currency: 'USD',
      directFlight: 'false',
      targetDate: Utils.getDefaultDateString()
    };
    if (args != null) {
      for (let argument of args) {
        let auxiliar = argument.split('=');
        if (auxiliar[0] in options) {
          options[auxiliar[0]] = auxiliar[1];
        } else {
          throw new Error('Invalid arguments error message!');
        }
      }
    }
    return options;
  }

  function flatDataArray(data) {
    var result = [];
    for (let doc of data) {
      for (let flight of doc) {
        result.push(flight);
      }
    }
    return result;
  }

  function run(args) {
    var options = retrieveScrapperOptionsFromArgs(args);
    debug('Executing with the following options :\n' + JSON.stringify(options, null, 2));
    let dates = Utils.retrieveFlightDatesArray(options.targetDate, options.periods, options.interval);
    debug('Querying for the following dates: ' + JSON.stringify(dates, null, 2));
    var scrapPromise = MomondoScrapper.scrap(options.from, options.to, dates, options.currency, options.directFlight);
    var persistencyPromise = scrapPromise.then((flights) => {
      return Persistency.persistFlightData(flatDataArray(flights));
    });
    return persistencyPromise.then((arg) => {
      debug('Successfully inserted ' + arg.length + ' entries!');
      return arg;
    });
  }

  return {
    run
  };
}

module.exports = flightScrapper();