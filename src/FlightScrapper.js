var chromedriver = require("chromedriver");
var MomondoQueryString = require("../src/MomondoQueryString");
var Flight = require("../src/Flight");
var Moment = require("moment");
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Webdriver = require("selenium-webdriver"),
    By = Webdriver.By;

const DATE_FORMAT = "DD-MM-YYYY";


function insertFlights(database, collection, port, flights) {

    MongoClient.connect("mongodb://localhost:" + port + "/" + database, function(err, db) {
        assert.equal(err, null);
        console.log("Successfully connected to " + database + " on " + port + "!");
        db.collection(collection).insertMany(flights, function(err, res) {
            assert.equal(err, null);
            if (res != null) {
                console.log("Successfully inserted data of " + res.insertedCount + " flights!");
            }
            db.close();
            console.log("Closed connection...");
        });
    });

}

class FlightScrapper {

    constructor(timeout, periods, interval, from, to, targetDate) {

        function calcDates(targetDate, periods, interval) {
            var result = [];
            targetDate = targetDate != null ? new Moment(targetDate) : new Moment();
            for (var i = 0; i < periods; i++) {
                targetDate = targetDate.add(interval, "hours");
                result.push(targetDate.format(DATE_FORMAT));
            }
            return result;
        }

        this.timeoutTime = timeout;
        this.dates = calcDates(targetDate, periods, interval);
        this.from = from;
        this.to = to;
        this.momondoUrl = "http://www.momondo.pt/flightsearch/?";
        this.browser = "chrome";
    }

    startBrowser(browser) {
        var driver = new Webdriver.Builder()
            .forBrowser(browser)
            .build();
        chromedriver.start();
        return driver;
    }

    retrieveFlightData(driver, fromAeroport, toAeroport, targetDate, timeoutTime) {
        var momondo = new MomondoQueryString(fromAeroport, toAeroport, targetDate);
        var fullUrl = this.momondoUrl + momondo.toString();

        driver.get(fullUrl);

        driver.wait(function() {
            return driver.findElement(By.id("flight-tickets-sortbar-cheapest")).isDisplayed();
        }, timeoutTime);

        driver.findElement(By.id("flight-tickets-sortbar-bestdeal")).click();

        driver.wait(function() {
            return driver.findElement(By.id("searchProgressText")).getText().then(function(text) {
                return text === "Pesquisa concluída";
            });
        }, timeoutTime);

        var resultsBoardElement = driver.findElement(By.id("results-tickets"));
        resultsBoardElement.findElements(By.css("div.result-box")).then(function(elements) {
            var resultBoxData = [];
            elements.forEach(function(val, idx) {
                resultBoxData.push(elements[idx].findElement(By.css("div.names")).getText());
                resultBoxData.push(elements[idx].findElement(By.css("div.price-pax .price span.value")).getText());
                resultBoxData.push(elements[idx].findElement(By.css(".travel-time")).getText());
            });
            Promise.all(resultBoxData).then(function(args) {
                let result = [];
                for (let i = 0; i + 2 < args.length; i = i + 3) {
                    result.push(new Flight(args[i], targetDate, args[i + 1], args[i + 2]));
                }
                insertFlights("flight-scrapper", "flight-data", 27017, result);
            });

        });
    }

    run() {
        var driver = this.startBrowser(this.browser);
        for (let targetDate of this.dates) {
            this.retrieveFlightData(driver, this.from, this.to, targetDate, this.timeoutTime);
        }
        driver.quit();
        chromedriver.stop();
    }
}

module.exports = FlightScrapper;
