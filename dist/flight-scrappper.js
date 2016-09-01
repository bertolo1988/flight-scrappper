var MomondoScrappper = require('../src/momondo-scrappper');
var Utils = require('../src/utils');
var Options = require('../src/options');
const debug = require('debug')('fligth-scrappper');

function flightScrappper() {

  function scrap(options, dates) {
    return MomondoScrappper.scrap(options.database, options.collection, options.routes, dates, options.currency, options.directFlight, options.browser);
  }

  function run(args) {
    let options = new Options(args).options;
    debug('Executing with the following options :\n' + Utils.prettifyObject(options));
    let dates = Utils.retrieveFlightDatesArray(options.targetDate, options.dateFormat, options.periods, options.interval);
    debug('Querying for the following dates:\n' + Utils.prettifyObject(dates));
    return scrap(options, dates).then((args) => {
      debug('Successfully inserted a total of ' + args.length + ' flights.');
      return args;
    });
  }

  return {
    run
  };
}

module.exports = flightScrappper();