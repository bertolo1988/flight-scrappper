const debug = require('debug')('persistency-module');
var MongoClient = require('mongodb').MongoClient;
var Config = require('../config');

function persistencyModule() {

	function persistFlightData(docs) {
		return new Promise(function(resolve, reject) {
			MongoClient.connect('mongodb://' + Config.DATABASE, function(err, db) {
				if (err != null) {
					reject(err);
				} else {
					debug('Successfully connected to ' + Config.DATABASE + ' !');
					db.collection(Config.COLLECTION).insertMany(docs, function(err, res) {
						if (res != null) {
							debug(JSON.stringify(res.insertedIds, null, 2));
							db.close();
							debug('Closed connection to ' + Config.DATABASE + ' !');
							resolve(res.insertedIds);
						} else {
							reject(err);
						}
					});
				}
			});
		});
	}

	return {
		persistFlightData
	};

}

module.exports = persistencyModule();