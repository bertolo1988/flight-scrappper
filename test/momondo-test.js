var should = require('should');
var MomondoQueryString = require('../src/momondo-query-string');
var MomondoScrapper = require('../src/momondo-scrapper');
var Utils = require('../src/utils');
var Options = require('../src/options');

describe('momondoScrapper test', function() {

	var options = new Options().options;
	this.timeout(options.timeout);

	it('should generate a valid momondo-query-string', (done) => {
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
		let targetDate = Utils.getDefaultDateString(options.dateFormat);
		let dates = Utils.retrieveFlightDatesArray(targetDate, options.dateFormat, 2, 24);
		let scrapPromise = MomondoScrapper.scrap('LON', 'BER', dates, 'EUR', false, options.browser);
		return scrapPromise.then((flights) => {
			(flights.length).should.be.exactly(30);
			flights[0].from.should.be.equal('LON');
			flights[0].time.date.should.be.equal(targetDate);
		});
	});

	it('should retrieve [] if there are no flights', () => {
		let targetDate = Utils.getDefaultDateString(options.dateFormat);
		let dates = Utils.retrieveFlightDatesArray(targetDate, options.dateFormat, 1, 24);
		let scrapPromise = MomondoScrapper.scrap('POR', 'PHI', dates, 'EUR', false, options.browser);
		return scrapPromise.then((flights) => {
			(flights.length).should.be.exactly(0);
		});
	});
});