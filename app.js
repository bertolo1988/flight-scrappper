var FlightScrapper = require("./src/FlightScrapper");

const HELP_TEXT = "Run the application using 'node app -timeout -periods -interval -from -to -targetDate'\n\t-timeout \tthe number of seconds to wait for browser queries\n\t-periods \tthe number of times that the program will search for data\n\t-interval \tthe number of hours in between data searches\n\t-from \t\tfrom aeroport\n\t-to \t\tdestination aeroport\n\t-targetDate \tday in wich the first search will be made. \n\nExamples\n'node app.js 50 2 48 LIS PAR 07/07/2005' \n\t- will result in 2 queries made 09/07/2005, 11/07/2005 in trips from Lisbon to Paris using a 50 second timeout\n\n'node app.js -dev' \n\t- is included for development purposes and it is the same as running the following command 'node app.js 100 2 48 LIS PAR today";
const INVALID_ARGS = "Invalid arguments! Try using -h to get some tips.";


function run(args) {
    if (args.length === 3 && args[2] === "-h") {
        console.log(HELP_TEXT);
    } else if (args.length === 3 && args[2] === "-dev") {
        new FlightScrapper(100 * 1000, 2, 48, "LIS", "PAR").run();
    } else if (args.length === 8) {
        new FlightScrapper(args[2] * 1000, args[3], args[4], args[5], args[6], args[7]).run();
    } else {
        throw new Error(INVALID_ARGS);
    }
}

run(process.argv);
