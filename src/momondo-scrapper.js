require('should');
var chromedriver = require('chromedriver');
var MomondoQueryString = require('../src/momondo-query-string');
var Flight = require('../src/flight');
var Config = require('../config');
var Webdriver = require('selenium-webdriver');
var By = Webdriver.By;
var driver;


function momondoScrapper() {

    function startBrowser() {
        driver = new Webdriver.Builder()
            .forBrowser(Config.BROWSER)
            .build();
        chromedriver.start();
    }

    function stopBrowser() {
        driver.quit();
        chromedriver.stop();
    }

    function parseFlightStops(arg) {
        switch (arg) {
            case 'DIRECT':
                return 0;
            case '1 STOP':
                return 1;
            case '2 STOP':
                return 2;
            default:
                return 3;
        }
    }

    function parseFlightPromises(args, date, from, to) {
        (args.length % 6).should.be.exactly(0, 'Error: Six values should be scrapped by flight!');
        let result = [];
        for (let i = 0; i + 6 <= args.length; i += 6) {
            let airline = args[i];
            let amount = args[i + 1];
            let currency = args[i + 2];
            let departure = args[i + 3];
            let duration = args[i + 4];
            let stops = parseFlightStops(args[i + 5]);
            let flight = new Flight(from, to, airline, stops, date, departure, duration, new Date(), amount, currency);
            result.push(flight);
        }
        return result;
    }

    function retrieveFlightPromises(elements) {
        var resultBoxData = [];
        elements.forEach(function(val, idx) {
            resultBoxData.push(elements[idx].findElement(By.css('div.names')).getText());
            resultBoxData.push(elements[idx].findElement(By.css('div.price-pax .price span.value')).getText());
            resultBoxData.push(elements[idx].findElement(By.css('div.price-pax .price span.unit')).getText());
            resultBoxData.push(elements[idx].findElement(By.css('div.departure > div > div.iata-time > span.time')).getText());
            resultBoxData.push(elements[idx].findElement(By.css('.travel-time')).getText());
            resultBoxData.push(elements[idx].findElement(By.css('div.travel-stops > .total')).getText());
        });
        return resultBoxData;
    }

    function buildUrl(fromAeroport, toAeroport, targetDate, currency, directFlight) {
        let momondo = new MomondoQueryString(fromAeroport, toAeroport, targetDate, currency, directFlight);
        return 'http://www.momondo.co.uk/flightsearch/?' + momondo.toString();
    }

    function retrieveFlightData(fromAeroport, toAeroport, targetDate, currency, directFlight) {
        return new Promise(function(resolve, reject) {
            var fullUrl = buildUrl(fromAeroport, toAeroport, targetDate, currency, directFlight);
            driver.get(fullUrl);
            driver.wait(function() {
                return driver.findElement(By.id('searchProgressText')).getText().then(function(text) {
                    return text === 'Search complete';
                });
            }).then(function() {
                var resultsBoardElement = driver.findElement(By.id('results-tickets'));
                resultsBoardElement.findElements(By.css('div.result-box')).then(function(elements) {
                    if (elements.length > 0) {
                        let resultBoxData = retrieveFlightPromises(elements);
                        Promise.all(resultBoxData).then(function(args) {
                            resolve(parseFlightPromises(args, targetDate, fromAeroport, toAeroport));
                        });
                    } else {
                        reject(0);
                    }
                });
            }).catch(() => reject(0));
        });
    }

    function scrap(from, to, dates, currency, directFlight) {
        return new Promise(function(resolve, reject) {
            startBrowser();
            var dataPromises = [];
            for (let targetDate of dates) {
                dataPromises.push(retrieveFlightData(from, to, targetDate, currency, directFlight));
            }
            Promise.all(dataPromises).then(function(args) {
                resolve(args);
            }, (err) => reject(err));
            stopBrowser();
        });
    }

    return {
        scrap
    };
}

module.exports = momondoScrapper();