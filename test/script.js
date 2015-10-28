var expect = require('expect');
var mockrequire = require('mockrequire');
var sinon = require('sinon');

var router;

describe('router', function() {
	var ipc = {
		on: sinon.spy(),
		send: sinon.stub()
	};
	var react = {};
	var reactDom = {};
	var document = {};
	var roundIndicator = 'roundIndicator';

	before(function() {
		global.document = document;

		router = mockrequire('../window/script', {
			'ipc': ipc,
			'react': react,
			'react-dom': reactDom,
			'./modules/round-indicator': roundIndicator,
			'./modules/player': {},
			'./settings': {}
		});
	});

	after(function() {
		global.document = undefined;
	});

	describe('"update/game/round" topic', function() {
		var spiedCall;

		beforeEach(function() {
			spiedCall = ipc.on.withArgs('update/game/round');
		});

		it('should listen to the topic', function() {
			expect(spiedCall.calledOnce).toBe(true);
		});

		describe('callback', function() {
			var callback;

			beforeEach(function() {
				callback = spiedCall.args[0][1];

				document.getElementById = sinon.stub().returns('dom-element');
				react.createElement = sinon.stub().returns('react-element');
				reactDom.render = sinon.stub();
			});

			it('should render', function() {
				reactDom.render = sinon.spy();
	
				callback();
	
				expect(reactDom.render.calledWith('react-element', 'dom-element')).toBe(true);
			});

			it('should render to DOM with id "roundLabel"', function() {
				document.getElementById = sinon.spy();

				callback();

				expect(document.getElementById.calledWith('roundLabel')).toBe(true);
			});

			it('should pass data to RoundIndicator as "roundNo"', function() {
				react.createElement = sinon.spy();

				callback('passed-data');

				expect(react.createElement.calledWith(roundIndicator, {roundNo: 'passed-data'})).toBe(true);
			});
		});
	});
});
