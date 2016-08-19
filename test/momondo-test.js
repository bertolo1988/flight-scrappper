var should = require('should');
var MomondoQueryString = require('../src/momondo-query-string');

describe('momondo-query-string test', () => {
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
});