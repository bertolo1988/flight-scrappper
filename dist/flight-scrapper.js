var Moment = require('moment');
var MongoClient = require('mongodb').MongoClient;
var MomondoScrapper = require('../src/momondo-scrapper');
var Config = require('../config');
var Utils = require('../src/utils');

function flightScrapper() {
  function retrieveScrapperOptionsFromArgs(args) {
    var options = {
      periods: 1,
      interval: 48,
      from: 'LIS',
      to: 'PAR',
      targetDate: new Moment(new Date().toISOString()).format(Config.DATE_FORMAT)
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

    options.dates = Utils.retrieveFlightDatesArray(options.targetDate, options.periods, options.interval);

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
          Utils.printText('Successfully connected to ' + Config.DATABASE + '!');
          let data = flatDataArray(docs);
          db.collection(Config.COLLECTION).insertMany(data, function(err, res) {
            if (res != null) {
              db.close();
              Utils.printText('Closed database connection!');
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
      MomondoScrapper.scrap(options.from, options.to, options.dates).then(function(flights) {
        persistFlightData(flights).then(function(arg) {
          resolve(arg);
        }, (err) => reject(err));
      }, (err) => reject(err));
    });
  }

  return {
    run
  };
}

module.exports = flightScrapper();