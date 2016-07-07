var chromedriver = require("chromedriver");
var MomondoQueryString = require("../src/MomondoQueryString");
var Moment = require("moment");
var Webdriver = require("selenium-webdriver"),
    By = Webdriver.By;
//until = webdriver.until;

const DATE_FORMAT = "DD-MM-YYYY";

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
                for (let i = 0; i < args.length;) {
                    var aux = args.splice(i, 3);
                    result.push({ airline: aux[0], date: targetDate, price: aux[1], duration: aux[2] });
                }
                console.log(result);
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
