const debug = require('debug')('momondo-scrappper');
var chromedriver = require('chromedriver');
var MomondoQueryString = require('../src/momondo-query-string');
var MomondoFlightBuilder = require('../src/momondo-flight-builder');
var Utils = require('../src/utils');
var Webdriver = require('selenium-webdriver');
var By = Webdriver.By;
var fs = require('fs');
var path = require('path');
var driver;

function momondoScrappper() {

    const SCRAPPED_VALUES = 11;

    function startBrowser(browser, args) {
        chromedriver.start(args);
        driver = new Webdriver.Builder()
            .forBrowser(browser)
            .build();
    }

    function stopBrowser() {
        driver.quit();
        chromedriver.stop();
    }

    function parseFlightPromises(args, date, dateFormat, from, to) {
        if (args.length != null && args.length % SCRAPPED_VALUES != 0) {
            throw new Error('Invalid number of scrapped values!');
        }
        let result = [];
        for (let i = 0; i + SCRAPPED_VALUES <= args.length; i += SCRAPPED_VALUES) {
            result.push(MomondoFlightBuilder.buildFlight(i, args, date, dateFormat, from, to));
        }
        return result;
    }

    function retrieveFlightPromises(elements) {
        var resultBoxData = [];
        elements.forEach((element) => {
            //airline
            resultBoxData.push(element.findElement(By.css('div.names')).getText());
            //amount
            resultBoxData.push(element.findElement(By.css('div.price-pax .price span.value')).getText());
            //currency
            resultBoxData.push(element.findElement(By.css('div.price-pax .price span.unit')).getText());
            //departure time
            resultBoxData.push(element.findElement(By.css('div.departure > div > div.iata-time > span.time')).getText());
            //arrival time
            resultBoxData.push(element.findElement(By.css('div.destination > div > div.iata-time > span.time')).getText());
            //days later
            resultBoxData.push(element.findElement(By.css('div.destination > div > div.iata-time > span.days-later')).getText().catch(() => {
                return Promise.resolve(0);
            }));
            //airport from
            resultBoxData.push(element.findElement(By.css('div.departure > div > div.iata-time > span.iata')).getText());
            //airport to
            resultBoxData.push(element.findElement(By.css('div.destination > div > div.iata-time > span.iata')).getText());
            //duration
            resultBoxData.push(element.findElement(By.css('.travel-time')).getText());
            //stops
            resultBoxData.push(element.findElement(By.css('div.travel-stops > .total')).getText());
            //class
            resultBoxData.push(element.findElement(By.css('div.info div.class')).getText());
        });
        return resultBoxData;
    }

    function buildUrl(fromAeroport, toAeroport, targetDate, currency, directFlight) {
        let momondo = new MomondoQueryString(fromAeroport, toAeroport, targetDate, currency, directFlight);
        return 'http://www.momondo.co.uk/flightsearch/?' + momondo.toString();
    }

    function takeScreenShot(route, targetDate) {
        driver.takeScreenshot().then((data) => {
            let todayDate = Utils.getTodayDateString('DD-MM-YYYY_HH_mm');
            let imgName = todayDate + '_' + route.from + '_' + route.to + '_' + targetDate + '.png';
            let ssPath = 'screenshots' + path.sep;
            fs.writeFileSync(ssPath + imgName, data, 'base64');
            debug('Screenshot saved at ' + ssPath + imgName + ' !');
        });
    }

    function filterSucessfullPromises(promisesMap) {
        var results = [];
        for (let p of promisesMap) {
            if (p.success) {
                results.push(p.result);
            }
        }
        return Promise.all(results);
    }

    function allSettled(promises) {
        return Promise.all(
            promises.map(
                (promise) => promise.then(
                    (result) => ({
                        result,
                        success: true
                    }),
                    (result) => ({
                        result,
                        success: false
                    })
                )
            )
        );
    }

    function retrieveFlightData(inProgressPromise, route, targetDate, dateFormat) {
        let resultBoxElementsPromise = inProgressPromise.then(() => {
            let resultsBoardElement = driver.findElement(By.id('results-tickets'));
            return resultsBoardElement.findElements(By.css('div.result-box.standard'));
        });
        let resultBoxDataPromise = resultBoxElementsPromise.then((elements) => {
            if (elements.length > 0) {
                let resultBoxData = retrieveFlightPromises(elements);
                return allSettled(resultBoxData).then((results) => {
                    return filterSucessfullPromises(results);
                });
            } else {
                debug('No data found!');
                return 0;
            }
        });
        return resultBoxDataPromise.then((args) => {
            let flights = parseFlightPromises(args, targetDate, dateFormat, route.from, route.to);
            debug(Utils.prettifyObject(flights.length > 0 ? flights[0] : flights));
            return flights;
        });
    }

    function retrieveFlightPage(route, targetDate, dateFormat, currency, directFlight, maximize) {
        let fullUrl = buildUrl(route.from, route.to, targetDate.format(dateFormat), currency, directFlight);
        if (maximize) {
            driver.manage().window().maximize();
        }
        driver.get(fullUrl);

        let inProgressPromise = driver.wait(() => {
            return driver.findElement(By.id('searchProgressText')).getText().then((text) => {
                return text === 'Search complete';
            });
        });
        return retrieveFlightData(inProgressPromise, route, targetDate, dateFormat);
    }

    function handleError(error) {
        debug(error);
        return Promise.resolve([]);
    }

    function scrap(route, date, dateFormat, currency, directFlight, maximize) {
        var retries = 1;
        try {
            return retrieveFlightPage(route, date, dateFormat, currency, directFlight, maximize).catch((error) => {
                takeScreenShot(route, date, dateFormat);
                if (retries > 0) {
                    retries--;
                    debug(error);
                    debug('Retrying...');
                    return retrieveFlightPage(route, date, dateFormat, currency, directFlight).catch(handleError);
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