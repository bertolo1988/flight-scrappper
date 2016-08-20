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

  function getData(options, dates) {
    return MomondoScrapper.scrap(options.from, options.to, dates, options.currency, options.directFlight);
  }

  function persistData(data) {
    return data.then((flights) => {
      return Persistency.insertFlights(flights);
    });
  }

  function run(args) {
    let options = retrieveScrapperOptionsFromArgs(args);
    debug('Executing with the following options :\n' + Utils.prettifyObject(options));
    let dates = Utils.retrieveFlightDatesArray(options.targetDate, options.periods, options.interval);
    debug('Querying for the following dates:\n' + Utils.prettifyObject(dates));
    let scrapPromise = getData(options, dates);
    let persistencyPromise = persistData(scrapPromise);
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