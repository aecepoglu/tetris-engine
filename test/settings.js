var expect = require('expect');
var settings = require('../window/settings');

describe('settings', function() {
	it('should set settings with given key and value', function() {
		expect(settings.mykey).toBe(undefined);
		settings.set('mykey', 'myvalue');
		expect(settings.mykey).toBe('myvalue');
	});
});
