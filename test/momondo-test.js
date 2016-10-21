var should = require('should');
var MomondoQueryString = require('../src/momondo-query-string');
var MomondoScrappper = require('../src/momondo-scrappper');
var Utils = require('../src/utils');
var Options = require('../src/options');
var Moment = require('moment');

describe('momondoScrappper test', function() {

    var options = new Options().options;
    this.timeout(options.timeout * 4);

    before(() => {
        MomondoScrappper.startBrowser('chrome');
    });

    after(() => {
        MomondoScrappper.stopBrowser();
    });

    it('should generate a valid momondo-query-string', (done) => {
        let query = new MomondoQueryString('LON', 'PAR', '23-05-2016', 'USD').toString();
        should.exist(query);
        (query.includes('USD')).should.be.true();
        (query.includes('23-05-2016')).should.be.true();
        (query.includes('LON')).should.be.true();
        (query.includes('PAR')).should.be.true();
        let attributes = query.split('&');
        (attributes.length).should.be.exactly(11);
        done();
    });

    it('should retrieve [] if there are no flights', () => {
        let targetDate = Utils.getDefaultDateString(options.dateFormat);
        let scrapPromise = MomondoScrappper.scrap({
            from: 'POR',
            to: 'PHI'
        }, targetDate, 'EUR', false);
        return scrapPromise.then((flights) => {
            (flights.length).should.be.exactly(0);
        });
    });

    it('should retrieve 60 flights for 2 route', () => {
        let targetDate = Utils.getDefaultDateString(options.dateFormat);
        let dates = Utils.retrieveFlightMoments(new Moment(targetDate, options.dateFormat), 2, 24);
        let routes = [{
            from: 'LON',
            to: 'BER'
        }, {
            from: 'MAD',
            to: 'LON'
        }];

        let scrapPromise = [];
        for (let route of routes) {
            for (let date of dates) {
                scrapPromise.push(MomondoScrappper.scrap(route, date, options.dateFormat, 'EUR', false));
            }
        }

        return Promise.all(scrapPromise).then((flights) => {
            flights = Utils.flattenArray(flights);
            (flights.length).should.be.exactly(60);
            flights[0].from.should.be.equal(routes[0].from);
            flights[0].time.date.should.be.equal(targetDate);
            flights[59].from.should.be.equal(routes[1].from);
            flights[59].time.date.should.be.equal(dates[1]);
        });
    });

});
