var test = require("unit.js");
var FlightDataScrapper = require("../src/FlightDataScrapper");

describe("FlightScrapper tests", function() {

    it("Object creation", function() {
        let flightSc = new FlightDataScrapper();
        test.assert(flightSc != null);
    });

    it("Constructor", function() {
        var dates = ["25-01-2017", "23-01-2017"];
        let flightSc = new FlightDataScrapper("db", "col", "45", "50", dates, "PAR", "ATH");
        test.object(flightSc).hasValue("chrome").hasValue(50 * 1000).hasValue(dates);
        test.object(flightSc).contains({ "database": "db", "port": "45" });
    });

});
