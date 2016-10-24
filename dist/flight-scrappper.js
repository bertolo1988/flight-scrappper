var MomondoScrappper = require('../src/momondo-scrappper');
var Utils = require('../src/utils');
var Persistency = require('../src/persistency-module');
var Options = require('../src/options');
var Progress = require('progress-barzz');
var Moment = require('moment');
const debug = require('debug')('fligth-scrappper');

function flightScrappper() {

    var options;

    function persistData(flights) {
        debug(Progress.tick());
        return Persistency.insertFlights(options.database, options.collection, flights);
    }

    function init(args) {
        options = new Options(args).options;
        debug('Executing with the following options :\n' + Utils.prettifyObject(options));
        let dates = Utils.retrieveFlightMoments(new Moment(options.targetDate, options.dateFormat), options.periods, options.interval);
        MomondoScrappper.startBrowser(options.browser, options.chromedriverArgs);
        Progress.init(dates.length * options.routes.length);
        return dates;
    }

    function end(args) {
        MomondoScrappper.stopBrowser();
        return Utils.flattenArray(args);
    }

    function run(args) {
        let dates = init(args);
        let persistPromises = [];
        for (let route of options.routes) {
            for (let date of dates) {
                debug('Query: from:' + route.from + ' to:' + route.to + ' date:' + date.format(options.dateFormat));
                let scrapPromise = MomondoScrappper.scrap(route, date, options.dateFormat, options.currency, options.directFlight, options.maximize);
                persistPromises.push(scrapPromise.then(persistData));
            }
        }
        return Promise.all(persistPromises).then(end).catch(end);
    }

    return {
        run
    };
}

module.exports = flightScrappper();