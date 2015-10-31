var ipc = require('ipc');
var React = require('react');
var ReactDOM = require('react-dom');

var RoundIndicator = require('./modules/round-indicator');
var Player = require('./modules/player');
var settings = require('./settings');
var playerDatas = require('./playerDatas');

var _private = {};

ipc.on('update/game/round', function(data) {
	ReactDOM.render(
		React.createElement(RoundIndicator, {roundNo: data}),
		document.getElementById('roundLabel')
	);
});

_private.updatePlayer = function(name) {
	ReactDOM.render(
		React.createElement(Player, playerDatas.getPlayer(name)),
		document.getElementById(name + '-container')
	);
};

ipc.on('settings/player_names', function(names) {
	names.forEach(function(name) {
		playerDatas.createPlayer(name);;

		var prefix = 'update/' + name;
		
		ipc.on(prefix + '/row_points', function(data) {
			playerDatas.setPlayer(name, 'row_points', data);
		});

		ipc.on(prefix + '/combo', function(data) {
			playerDatas.setPlayer(name, 'combo', data);
		});

		ipc.on(prefix + '/field', function(data) {
			playerDatas.setPlayer(name, 'field', data);
		});

		_private.updatePlayer(name);
	});
});

ipc.on('settings/field_width', function(data) {
	settings.set('field_width', data);
});

ipc.on('settings/field_height', function(data) {
	settings.set('field_height', data);
});

ipc.on('update/game/next_piece_type', function(shape) {
	playerDatas.setAllPlayers('next_piece_type', shape);
});

ipc.on('update/game/this_piece_type', function(shape) {
	playerDatas.setAllPlayers('this_piece_type', shape);
});

ipc.on('update/game/this_piece_position', function(pos) {
	playerDatas.setAllPlayers('this_piece_position', pos);
});

_private.updateAllPlayers = function() {
	playerDatas.forEach(function(player, name) {
		_private.updatePlayer(name);
	});
};

ipc.on('window/draw', _private.updateAllPlayers);

var nextRoundClicked =
_private.nextRoundClicked = function() {
	_private.updateAllPlayers();

	ipc.send('engine/next_round', null);
};

/* init */
ipc.send('engine/start', null);

module.exports = {
	_private: _private
};
