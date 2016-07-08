var FlightScrapper = require("./src/FlightScrapper");
var Moment = require("moment");


function run(args) {

    const HELP_TEXT = "\nIf an option is not defined, a default value will be used instead.\nThe following options are available:\n\tdatabase\tmongodb database to connect to\n\tcollection\tcollection to be used inside the database\n\tport\t\tto connecto to the database\n\ttimeout\t\tdefines the limit, in seconds, to wait for a web browser query\n\tperiods\t\tspecifies the number of queries that will be made\n\tinterval\tnumber of hours between the queries\n\tfrom\t\tdeparture aeroport\n\tto\t\tdestination\n\ttargetDate\ttargetDate + interval specify the date of the first query";
    const HELP_EXAMPLES = "\n\n\nExamples:\n$ node app.js\nWill use default values\n\n$ node app.js targetDate=23-05-2017 from='NYC' periods=3\nWill use all default values while overriding targetDate, departure aeroport and periods. The data will be stored in the 'flight-scrapper' database, 'flight-data' collection using the '27017' port. The data will represent the available flights between New York ('NYC') and Paris ('PAR') in the following dates 25-05, 27-05, 29-05 of 2017. Note that the first date being queried is targetDate + interval.";
    const HELP_NOTES = "\n\nNotes: In each query you will be shown, at start, wich are the values that are being used.\nRepository: 'https://github.com/bertolo1988/flight-scrapper'";
    const INVALID_ARGUMENTS = "Invalid arguments error message!";
    const DATE_FORMAT = "DD-MM-YYYY";
    const options = ["help", "database", "collection", "port", "timeout", "periods", "interval", "from", "to", "targetDate"];

    args = args.splice(2, args.length);

    function calcDates(targetDate, periods, interval) {
        var result = [];
        targetDate = new Moment(targetDate, DATE_FORMAT);
        for (var i = 0; i < periods; i++) {
            targetDate = targetDate.add(interval, "hours");
            result.push(targetDate.format(DATE_FORMAT));
        }
        return result;
    }

    var inputs = {
        database: "flight-scrapper",
        collection: "flight-data",
        port: "27017",
        timeout: 90,
        periods: 2,
        interval: 48,
        from: "LIS",
        to: "PAR",
        targetDate: new Moment(new Date()).format(DATE_FORMAT).toString()
    };

    if (args.indexOf(options[0]) > -1) {
        console.log(HELP_TEXT + HELP_EXAMPLES + HELP_NOTES);
    } else {

        for (let argument of args) {
            let auxiliar = argument.split("=");
            if (options.indexOf(auxiliar[0]) > -1) {
                inputs[auxiliar[0]] = auxiliar[1];
            } else {
                throw new Error(INVALID_ARGUMENTS);
            }
        }
        console.log("Executing with the following options :\n" + JSON.stringify(inputs));

        var dates = calcDates(inputs.targetDate, parseInt(inputs.periods), parseInt(inputs.interval));
        new FlightScrapper(inputs.database, inputs.collection, inputs.port, inputs.timeout, dates, inputs.from, inputs.to).run();
    }
}

run(process.argv);
