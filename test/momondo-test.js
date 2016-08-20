var should = require('should');
var MomondoQueryString = require('../src/momondo-query-string');
var MomondoScrapper = require('../src/momondo-scrapper');
var Utils = require('../src/utils');
var Config = require('../config');

describe('momondoScrapper test', function() {
	this.timeout(Config.TIMEOUT);
	it('should generate a good momondo-query-string', (done) => {
		let query = new MomondoQueryString('LON', 'PAR', '23-05-2016', 'USD').toString();
		should.exist(query);
		(query.includes('USD')).should.be.true();
		(query.includes('23-05-2016')).should.be.true();
		(query.includes('LON')).should.be.true();
		(query.includes('PAR')).should.be.true();
		var attributes = query.split('&');
		(attributes.length).should.be.exactly(11);
		done();
	});
	it('should retrieve 30 flights', () => {
		let targetDate = Utils.getDefaultDateString();
		let dates = Utils.retrieveFlightDatesArray(targetDate, 2, 24);
		let scrapPromise = MomondoScrapper.scrap('LON', 'BER', dates, 'EUR', false);
		return scrapPromise.then((flights) => {
			(flights.length).should.be.exactly(30);
			flights[0].from.should.be.equal('LON');
			flights[0].time.date.should.be.equal(targetDate);
		});
	});
	it('should retrieve []', () => {
		let targetDate = Utils.getDefaultDateString();
		let dates = Utils.retrieveFlightDatesArray(targetDate, 1, 24);
		let scrapPromise = MomondoScrapper.scrap('POR', 'PHI', dates, 'EUR', false);
		return scrapPromise.then((flights) => {
			(flights.length).should.be.exactly(0);
		});
	});
});