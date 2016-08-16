var Moment = require('moment');
var MongoClient = require('mongodb').MongoClient;
var MomondoScrapper = require('../src/momondo-scrapper');
var should = require('should');
var Config = require('../config');
var Utils = require('../src/utils');

function FlightScrapper() {

    function retrieveScrapperOptionsFromArgs(args) {
        var options = {
            periods: 1,
            interval: 48,
            from: 'LIS',
            to: 'PAR',
            targetDate: new Moment(new Date().toISOString())
        };

        for (let argument of args) {
            let auxiliar = argument.split('=');
            if (auxiliar[0] in options) {
                options[auxiliar[0]] = auxiliar[1];
            } else {
                throw new Error('Invalid arguments error message!');
            }
        }
        options.dates = Utils.retrieveFlightDatesArray(options.targetDate, options.periods, options.interval);
        return options;
    }

    function persistFlightData(docs) {
        MongoClient.connect('mongodb://' + Config.DATABASE, function(err, db) {
            should.not.exist(err);
            Utils.printText('Successfully connected to ' + Config.DATABASE + '!');
            db.collection(Config.COLLECTION).insertMany(docs, function(err, res) {
                should.not.exist(err);
                Utils.printText('Successfully inserted data of ' + res.insertedCount + ' docs!');
                db.close();
                Utils.printText('Closed connection...');
            });
        });
    }

    function run(args) {
        var options = retrieveScrapperOptionsFromArgs(args);
        Utils.printText('Executing with the following options :\n' + JSON.stringify(options, null, 2));
        MomondoScrapper.scrap(options.from, options.to, options.dates, persistFlightData);
    }

    return { run: run };
}

module.exports = FlightScrapper();
