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
	var settings = {};
	var playerDatas = {};

	before(function() {
		global.document = document;

		router = mockrequire('../window/script', {
			'ipc': ipc,
			'react': react,
			'react-dom': reactDom,
			'./modules/round-indicator': roundIndicator,
			'./modules/player': {},
			'./settings': settings,
			'./playerDatas': playerDatas
		});
	});

	afterEach(function() {
		global.document = undefined;
	});

	describe('on "update/game/round"', function() {
		var callback;

		beforeEach(function() {
			callback = ipc.on.withArgs('update/game/round').args[0][1];

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

	['field_width', 'field_height']
	.forEach(function(settingType) {
		var routeUrl = 'settings/' + settingType;

		it('on "' + routeUrl + '" should set settings with given value', function() {
			var callback = ipc.on.withArgs(routeUrl).args[0][1];

			settings.set = sinon.spy();

			callback('data');

			expect(settings.set.args[0]).toEqual([settingType, 'data']);

			settings.set = undefined;
		});
	});

	['next_piece_type', 'this_piece_type', 'this_piece_position']
	.forEach(function(updateType) {
		var topic = 'update/game/' + updateType;

		it('on "' + topic + '" should call setAllPlayers("' + updateType + '", <passed-data>)', function() {
			var callback = ipc.on.withArgs(topic).args[0][1];

			playerDatas.setAllPlayers = sinon.spy();

			callback('passed-data');

			expect(playerDatas.setAllPlayers.args[0]).toEqual([updateType, 'passed-data']);
		});
	});

	describe('"window/draw"', function() {
		var spiedCall;

		beforeEach(function() {
			spiedCall = ipc.on.withArgs('window/draw');
		});

		it('should be listened', function() {
			expect(spiedCall.calledOnce).toBe(true);
		});

		it('should call private updateAllPlayers()', function() {
			expect(spiedCall.args[0][1]).toBe(router._private.updateAllPlayers);
		});
	});

	it('private updateAllPlayers() should call private updatePlayer() as a callback to playerDatas.forEach', function() {
		playerDatas.forEach = function(cb) {
			cb(undefined, 'name1');
		};

		var fun = sinon.stub(router._private, 'updatePlayer').returns(undefined);

		router._private.updateAllPlayers();

		expect(fun.calledWith('name1')).toBe(true);

		fun.restore();
	});

	it('should send null message to "engine/start"', function() {
		expect(ipc.send.calledWith("engine/start", null)).toBe(true);
	});

	describe('private nextRoundClicked()', function() {
		beforeEach(function() {
			sinon.stub(router._private, 'updateAllPlayers');

			router._private.nextRoundClicked();
		});

		afterEach(function() {
			router._private.updateAllPlayers.restore();
		});

		it('should call private updateAllPlayers()', function() {
			expect(router._private.updateAllPlayers.calledOnce).toBe(true);
		});

		it('should send null to "engine/next_round"', function() {
			expect(ipc.send.calledWith('engine/next_round', null)).toBe(true);
		});
	});
});
