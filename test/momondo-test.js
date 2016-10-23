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

    function getDefaultMoment() {
        return new Moment(new Date().toISOString()).add(2, 'days');
    }

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
        let scrapPromise = MomondoScrappper.scrap({
            from: 'POR',
            to: 'PHI'
        }, getDefaultMoment(), options.dateFormat, 'EUR', false, false);
        return scrapPromise.then((flights) => {
            (flights.length).should.be.exactly(0);
        });
    });

    function compareFlightTime(flightTime, dateMoment) {
        flightTime.day.should.be.eql(parseInt(dateMoment.format('DD')));
        flightTime.month.should.be.eql(parseInt(dateMoment.format('MM')));
        flightTime.year.should.be.eql(parseInt(dateMoment.format('YYYY')));
    }

    function checkFlightTimeFields(flightTime) {
        flightTime.minute.should.within(0, 60);
        flightTime.hour.should.within(0, 24);
        flightTime.day.should.within(1, 31);
        flightTime.month.should.within(1, 12);
        flightTime.year.should.above(2015);
    }

    function checkFlightSearch(search) {
        search.from.should.not.be.null().and.be.a.String();
        search.to.should.not.be.null().and.be.a.String();
        search.source.should.not.be.null().and.be.a.String();
        search.queried.should.not.be.null().and.be.a.Date();
    }

    function checkFlightData(data) {
        data.duration.should.be.above(0);
        data.stops.should.be.aboveOrEqual(0);

        data.price.amount.should.be.aboveOrEqual(1);
        data.price.currency.should.not.be.null().and.be.a.String();

        checkFlightTimeFields(data.departure.time);
        data.departure.airport.should.not.be.null().and.be.a.String();

        checkFlightTimeFields(data.arrival.time);
        data.arrival.airport.should.not.be.null().and.be.a.String();
    }

    function checkFlightFields(flights) {
        for (let flight of flights) {
            checkFlightSearch(flight.search);
            checkFlightData(flight.data);
        }
    }

    it('should retrieve several flights from diverse routes', () => {
        let days = 2;
        let dates = Utils.retrieveFlightMoments(getDefaultMoment(), days, 24);
        let routes = [{
            from: 'LON',
            to: 'BER'
        }, {
            from: 'MAD',
            to: 'LON'
        }];
        let expectedResults = days * 15 * routes.length;
        let scrapPromise = [];
        for (let route of routes) {
            for (let date of dates) {
                scrapPromise.push(MomondoScrappper.scrap(route, date, options.dateFormat, 'EUR', false, false));
            }
        }
        return Promise.all(scrapPromise).then((flights) => {
            flights = Utils.flattenArray(flights);
            flights.length.should.be.eql(expectedResults);
            flights[0].search.from.should.be.equal(flights[expectedResults - 1].search.to);
            flights[0].search.source.should.be.equal(flights[expectedResults - 1].search.source);
            checkFlightFields(flights);
            compareFlightTime(flights[0].data.departure.time, dates[0]);
            compareFlightTime(flights[expectedResults - 1].data.departure.time, dates[dates.length - 1]);
        });
    });

});