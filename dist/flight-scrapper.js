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

  function sendData(docs, resolve, reject) {
    MongoClient.connect('mongodb://' + Config.DATABASE, function(err, db) {
      if (err != null) {
        reject(err);
      } else {
        Utils.printText('Successfully connected to ' + Config.DATABASE + '!');
        db.collection(Config.COLLECTION).insertMany(docs, function(err, res) {
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
  }

  function persistFlightData(docs) {
    return new Promise(function(resolve, reject) {
      if (docs.length == 0) {
        Utils.printText('No data to be inserted!');
        resolve(0);
      } else {
        sendData(docs, resolve, reject);
      }
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