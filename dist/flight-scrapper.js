var MomondoScrapper = require('../src/momondo-scrapper');
var Persistency = require('../src/persistency-module');
var Utils = require('../src/utils');
var Options = require('../src/options');
const debug = require('debug')('fligth-scrapper');

function flightScrapper() {

  function getData(options, dates) {
    return MomondoScrapper.scrap(options.routes, dates, options.currency, options.directFlight, options.browser);
  }

  function persistData(options, data) {
    return data.then((flights) => {
      return Persistency.insertFlights(options.database, options.collection, flights);
    });
  }

  function run(args) {
    let options = new Options(args).options;
    debug('Executing with the following options :\n' + Utils.prettifyObject(options));
    let dates = Utils.retrieveFlightDatesArray(options.targetDate, options.dateFormat, options.periods, options.interval);
    debug('Querying for the following dates:\n' + Utils.prettifyObject(dates));
    let scrapPromise = getData(options, dates);
    let persistencyPromise = persistData(options, scrapPromise);
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