var expect = require('expect');
var sinon = require('sinon');

var players = require('../window/playerDatas');

describe('playerDatas', function() {
	beforeEach(function() {
		players._data = {};
	});

	afterEach(function() {
		players._data = {};
	});

	it('.createPlayer(name) should create a player with given name', function() {
		players._data.name1 = undefined;

		players.createPlayer('name1');

		expect(players._data.name1).toEqual({});
	});

	it('.setPlayer(player, key, value) to set given data', function() {
		players._data.player1 = {};

		players.setPlayer('player1', 'key1', 'value1');

		expect(players._data.player1).toEqual({key1: 'value1'});
	});

	it('getPlayer(player) to return data of given player', function() {
		players._data.player1 = 'player1data';

		expect(players.getPlayer('player1')).toEqual('player1data');
	});

	it('setAllPlayers(key, value) to set data for all players', function() {
		players._data.player1 = {};
		players._data.player2 = {};

		players.setAllPlayers('key1', 'value1');

		expect(players._data).toEqual({
			player1: {key1: 'value1'},
			player2: {key1: 'value1'},
		});
	});

	it('.forEach(callback) should iterate over players and call callback', function() {
		players._data.player1 = 'data1';
		players._data.player2 = 'data2';

		var callback = sinon.spy();

		players.forEach(callback);

		expect(callback.args).toEqual([
			['data1', 'player1'],
			['data2', 'player2']
		]);
	});
});
