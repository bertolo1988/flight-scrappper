const debug = require('debug')('persistency-module');
var MongoClient = require('mongodb').MongoClient;

function persistencyModule() {

    const NO_DATABASE = 'none';

    function getConnection(database) {
        return MongoClient.connect('mongodb://' + database);
    }

    function insertFlights(database, collection, docs) {
        if (database === NO_DATABASE) {
            return Promise.resolve(docs);
        }
        if (!docs || docs.length <= 0) {
            debug('No data to be inserted');
            return Promise.resolve([]);
        } else {
            let connect = getConnection(database);
            return connect.then((db) => {
                debug('Successfully connected to ' + database);
                let insertion = db.collection(collection).insertMany(docs);
                return insertion.then((res) => {
                    debug('Persisted ' + res.insertedIds.length + ' results');
                    db.close();
                    debug('Closed connection to ' + database);
                    return res.insertedIds;
                });
            });
        }
    }

    function removeFlights(database, collection, ids) {
        if (database === NO_DATABASE) {
            return Promise.resolve(ids);
        }
        let connect = getConnection(database);
        return connect.then((db) => {
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
        });
    }

    return {
        NO_DATABASE,
        insertFlights,
        removeFlights
    };
}

module.exports = persistencyModule();