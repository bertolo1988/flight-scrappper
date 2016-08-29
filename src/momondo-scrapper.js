const debug = require('debug')('momondo-scrapper');
var chromedriver = require('chromedriver');
var MomondoQueryString = require('../src/momondo-query-string');
var Flight = require('../src/flight');
var Utils = require('../src/utils');
var Webdriver = require('selenium-webdriver');
var By = Webdriver.By;
var driver;
var MomondoBaseUrl = 'http://www.momondo.co.uk/flightsearch/?';

function momondoScrapper() {

    function startBrowser(browser) {
        driver = new Webdriver.Builder()
            .forBrowser(browser)
            .build();
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

    function flatDataArray(data) {
        var result = [];
        for (let doc of data) {
            for (let flight of doc) {
                result.push(flight);
            }
        }
        return result;
    }

    function parseFlightPromises(args, date, from, to) {
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
        return MomondoBaseUrl + momondo.toString();
    }

    function retrieveFlightData(fromAeroport, toAeroport, targetDate, currency, directFlight) {
        let fullUrl = buildUrl(fromAeroport, toAeroport, targetDate, currency, directFlight);
        driver.get(fullUrl);
        let inProgressPromise = driver.wait(function() {
            return driver.findElement(By.id('searchProgressText')).getText().then(function(text) {
                return text === 'Search complete';
            });
        });
        let resultBoxElementsPromise = inProgressPromise.then(function() {
            let resultsBoardElement = driver.findElement(By.id('results-tickets'));
            return resultsBoardElement.findElements(By.css('div.result-box'));
        });
        let resultBoxDataPromise = resultBoxElementsPromise.then(function(elements) {
            if (elements.length > 0) {
                let resultBoxData = retrieveFlightPromises(elements);
                return Promise.all(resultBoxData);
            } else {
                debug('No data found!');
                return 0;
            }
        });

        return resultBoxDataPromise.then(function(args) {
            return parseFlightPromises(args, targetDate, fromAeroport, toAeroport);
        });

    }

    function scrap(routes, dates, currency, directFlight, browser) {
        startBrowser(browser);
        let dataPromises = [];
        for (let route of routes) {
            for (let targetDate of dates) {
                debug('Pushed a promise of scrapped data.');
                dataPromises.push(retrieveFlightData(route.from, route.to, targetDate, currency, directFlight));
            }
        }
        return Promise.all(dataPromises).then((args) => {
            let flattenedFlights = flatDataArray(args);
            debug('Retrieved flights:\n' + Utils.prettifyObject(flattenedFlights));
            stopBrowser();
            return flattenedFlights;
        });
    }

    return {
        scrap
    };
}

module.exports = momondoScrapper();