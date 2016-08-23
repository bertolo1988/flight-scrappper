require('should');
var Options = require('../src/options');

describe('options test', () => {

	it('should get the same options object regardless of the input', () => {
		let optionsArrayStr = JSON.stringify(new Options(['to=MAD', 'timeout=300']));
		let optionsObjStr = JSON.stringify(new Options({
			to: 'MAD',
			timeout: '300'
		}));
		optionsArrayStr.localeCompare(optionsObjStr).should.be.exactly(0);
	});

});