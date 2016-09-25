const debug = require('debug')('momondo-scrappper');
var chromedriver = require('chromedriver');
var MomondoQueryString = require('../src/momondo-query-string');
var Flight = require('../src/flight');
var Utils = require('../src/utils');
var Webdriver = require('selenium-webdriver');
var By = Webdriver.By;
var fs = require('fs');
var driver;

function momondoScrappper() {

    const sourceName = 'momondo';
    const MomondoBaseUrl = 'http://www.momondo.co.uk/flightsearch/?';

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

    function retrieveDigit(input) {
        return parseInt(input.replace(/^\D+/g, ''));
    }

    function parseDuration(duration) {
        let durationMinutes = 0;
        let splittedDuration = duration.split(' ');
        for (let unit of splittedDuration) {
            switch (unit[unit.length - 1]) {
                case 'h':
                    durationMinutes += retrieveDigit(unit) * 60;
                    break;
                case 'm':
                    durationMinutes += retrieveDigit(unit);
                    break;
                default:
                    durationMinutes += retrieveDigit(unit);
                    break;
            }
        }
        return durationMinutes;
    }

    function parseFlightPromises(args, date, from, to) {
        let result = [];
        for (let i = 0; i + 6 <= args.length; i += 6) {
            let airline = args[i];
            let amount = parseInt(args[i + 1]);
            let currency = args[i + 2];
            let departure = args[i + 3];
            let duration = parseDuration(args[i + 4]);
            let stops = parseFlightStops(args[i + 5]);
            let flight = new Flight(from, to, sourceName, airline, stops, date, departure, duration, new Date(), amount, currency);
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

    function takeScreenShot(route, targetDate) {
        driver.takeScreenshot().then(function(data) {
            let todayDate = Utils.getTodayDateString('DD-MM-YYYY hh:mm a');
            let imgName = todayDate + '_' + route.from + '_' + route.to + '_' + targetDate + '.png';
            let ssPath = 'screenshots/';
            fs.writeFileSync(ssPath + imgName, data, 'base64');
            debug('Screenshot saved at ' + ssPath + imgName + ' !');
        });
    }

    function retrieveFlightData(route, targetDate, currency, directFlight) {
        let fullUrl = buildUrl(route.from, route.to, targetDate, currency, directFlight);
        driver.manage().window().maximize();
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
            let flights = parseFlightPromises(args, targetDate, route.from, route.to);
            debug(Utils.prettifyObject(flights.length > 0 ? flights[0] : flights));
            return flights;
        });
    }

    function handleError(error) {
        debug(error);
        return Promise.resolve([]);
    }

    function scrap(route, date, currency, directFlight) {
        var retries = 1;
        try {
            return retrieveFlightData(route, date, currency, directFlight).catch((error) => {
                takeScreenShot(route, date);
                if (retries > 0) {
                    retries--;
                    debug(error);
                    debug('Retrying...');
                    return retrieveFlightData(route, date, currency, directFlight).catch(handleError);
                } else {
                    return handleError(error);
                }
            });
        } catch (error) {
            takeScreenShot(route, date);
            return handleError(error);
        }
    }

    return {
        scrap,
        startBrowser,
        stopBrowser
    };
}

module.exports = momondoScrappper();