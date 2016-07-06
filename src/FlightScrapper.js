    By = webdriver.By;
//until = webdriver.until;

const DATE_FORMAT = "DD-MM-YYYY";

class FlightScrapper {

    constructor(timeout, periods, interval, from, to, targetDate) {

        function calcDates(targetDate, periods, interval) {
            var result = [];
            targetDate = targetDate != null ? new moment(targetDate) : new moment();
            for (var i = 0; i < periods; i++) {
                targetDate = targetDate.add(interval, 'days');
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
        var driver = new webdriver.Builder()
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
        }, timeoutTime);


        driver.wait(function() {
            });
        }, timeoutTime);

            var resultBoxData = [];
            elements.forEach(function(val, idx) {
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
