var FlightScrapper = require("./src/FlightScrapper");

const HELP_TEXT = "Help text";
const INVALID_args = "Invalid arguments! Try using -h to get some tips.";


function run(args) {
    if (args.length === 3 && args[2] === "-h") {
        console.log(HELP_TEXT);
    } else if (args.length === 3 && args[2] === "-dev") {
        new FlightScrapper(100 * 1000, 2, 3, "LIS", "PAR").run();
    } else if (args.length === 8) {
        new FlightScrapper(args[2] * 1000, args[3], args[4], args[5], args[6], args[7]).run();
    } else {
        throw new Error(INVALID_args);
    }
}

run(process.argv);
