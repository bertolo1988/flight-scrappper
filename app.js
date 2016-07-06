var chromedriver = require('chromedriver');
var MomondoQuery = require('./momondo-query-string');
var moment = require('moment');
var webdriver = require('selenium-webdriver'),
    By = webdriver.By;
/*until = webdriver.until;*/
var TIMEOUT = 100000,
    PERIOD_COUNT = 5,
    DAYS_INTERVAL = 3;
var momondoUrl = 'http://www.momondo.pt/flightsearch/?';
var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();
chromedriver.start();
var fromAeroport = 'LIS',
    toAeroport = 'PAR';

function calcDates() {
    var result = [];
    var date = moment(new Date());
    for (var i = 0; i < PERIOD_COUNT; i++) {
        date = date.add(DAYS_INTERVAL, 'days');
        result.push(date.format('DD-MM-YYYY'));
    }
    return result;
}

function buildFlightsFromData(data, targetDate) {
    var result = [];
    for (var i = 0; i < data.length;) {
        var aux = data.splice(i, 3);
        result.push({ airline: aux[0], date: targetDate, price: aux[1], duration: aux[2] });
    }
    return result;
}

function retrieveFlightData(fromAeroport, toAeroport, targetDate) {
    var momondo = new MomondoQuery(fromAeroport, toAeroport, targetDate);
    var fullUrl = momondoUrl + momondo.toString();

    driver.get(fullUrl);

    driver.wait(function() {
        return driver.findElement(By.id('flight-tickets-sortbar-cheapest')).isDisplayed();
    }, TIMEOUT);

    driver.findElement(By.id('flight-tickets-sortbar-bestdeal')).click();

    driver.wait(function() {
        return driver.findElement(By.id('searchProgressText')).getText().then(function(text) {
            return text === 'Pesquisa concluída';
        });
    }, TIMEOUT);

    var resultsBoardElement = driver.findElement(By.id('results-tickets'));
    resultsBoardElement.findElements(By.css('div.result-box')).then(function(elements) {
        var resultBoxData = [];
        elements.forEach(function(val, idx) {
            resultBoxData.push(elements[idx].findElement(By.css('div.names')).getText());
            resultBoxData.push(elements[idx].findElement(By.css('div.price-pax .price span.value')).getText());
            resultBoxData.push(elements[idx].findElement(By.css('.travel-time')).getText());
        });
        Promise.all(resultBoxData).then(function(args) {
            console.log(buildFlightsFromData(args, targetDate));
        });
    });
}

var dates = calcDates();
dates.forEach(function(targetDate) {
    retrieveFlightData(fromAeroport, toAeroport, targetDate);
});

driver.quit();
chromedriver.stop();
