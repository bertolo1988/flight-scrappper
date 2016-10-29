const debug = require('debug')('persistency-module');
var MongoClient = require('mongodb').MongoClient;

function persistencyModule() {

    const NO_DATABASE = 'none';

    function executeAction(database, collection, data, callback) {
        if (database === NO_DATABASE) {
            return Promise.resolve(data);
        }
        if (!data || data.length <= 0) {
            debug('No data to be changed');
            return Promise.resolve([]);
        }
        let connection = MongoClient.connect('mongodb://' + database);
        return connection.then((db) => {
            debug('Successfully connected to ' + database);
            return callback(db, collection, data);
        }).catch((err) => {
            debug('Failed to connect to ' + database);
            return err;
        });
    }

    function insertData(db, collection, docs) {
        let insertion = db.collection(collection).insertMany(docs);
        return insertion.then((res) => {
            debug('Persisted ' + res.insertedIds.length + ' results');
            db.close();
            return res.insertedIds;
        });
    }

    function removeData(db, collection, ids) {
        let target = {
            '_id': {
                '$in': ids
            }
        };
        let removal = db.collection(collection).deleteMany(target);
        return removal.then((res) => {
            db.close();
            return res.result.n;
        });
    }

    return {
        NO_DATABASE,
        insertFlights(database, collection, docs) {
            return executeAction(database, collection, docs, insertData);
        },
        removeFlights(database, collection, ids) {
            return executeAction(database, collection, ids, removeData);
        }
    };
}

module.exports = persistencyModule();