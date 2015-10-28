var expect = require('expect');
var config = require('../window/config');

describe('config object', function() {
	it('should have TILE_LEN', function() {
		expect(config.TILE_LEN).toNotBe(undefined);
	});
});
