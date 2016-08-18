var should = require('should');
var MomondoQueryString = require('../src/momondo-query-string');

describe('momondo-query-string test', () => {
	it('should generate a good momondo-query-string', (done) => {
		let query = new MomondoQueryString('LON', 'LON', '23-05-2016', 'USD').toString();
		should.exist(query);
		var attributes = query.split('&');
		(attributes.length).should.be.exactly(11);
		done();
	});
});