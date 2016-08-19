var Moment = require('moment');
var MongoClient = require('mongodb').MongoClient;
var MomondoScrapper = require('../src/momondo-scrapper');
var Config = require('../config');
var Utils = require('../src/utils');

function flightScrapper() {

  function getDefaultDateString() {
    return new Moment(new Date().toISOString()).add(2, 'days').format(Config.DATE_FORMAT);
  }

  function retrieveScrapperOptionsFromArgs(args) {
    var options = {
      periods: 1,
      interval: 48,
      from: 'LIS',
      to: 'PAR',
      currency: 'USD',
      directFlight: 'false',
      targetDate: getDefaultDateString()
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

  function persistFlightData(docs) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect('mongodb://' + Config.DATABASE, function(err, db) {
        if (err != null) {
          reject(err);
        } else {
          db.collection(Config.COLLECTION).insertMany(docs, function(err, res) {
            if (res != null) {
              db.close();
              resolve(res.insertedCount);
            } else {
              reject(err);
            }
          });
        }
      });
    });
  }

  function run(args) {
    return new Promise(function(resolve, reject) {
      var options = retrieveScrapperOptionsFromArgs(args);
      Utils.printText('Executing with the following options :\n' + JSON.stringify(options, null, 2));
      let dates = Utils.retrieveFlightDatesArray(options.targetDate, options.periods, options.interval);
      Utils.printText('Querying for the following dates: ' + JSON.stringify(dates, null, 2));
      MomondoScrapper.scrap(options.from, options.to, dates, options.currency, options.directFlight).then(function(flights) {
        persistFlightData(flatDataArray(flights)).then(function(arg) {
          Utils.printText('Successfully inserted ' + arg + ' entries!');
          resolve(arg);
        }, (err) => {
          Utils.printText('Unable to persist data!');
          reject(err);
        });
      }, (err) => {
        if (!(err instanceof Error)) {
          Utils.printText('Scrapped no data!');
        }
        reject(err);
      });
    });
  }

  return {
    run
  };
}

module.exports = flightScrapper();