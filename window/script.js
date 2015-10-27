var ipc = require('ipc');
var React = require('react');
var ReactDOM = require('react-dom');

var RoundIndicator = require('./modules/round-indicator');
var Player = require('./modules/player');
var settings = require('./settings');

var playerDatas = {};

ipc.on('update/game/round', function(data) {
	ReactDOM.render(
		React.createElement(RoundIndicator, {roundNo: data}),
		document.getElementById('roundLabel')
	);
});

function updatePlayer(name) {
	ReactDOM.render(
		React.createElement(Player, playerDatas[name]),
		document.getElementById(name + '-container')
	);
}

ipc.on('settings/player_names', function(names) {
	names.forEach(function(name) {
		playerDatas[name] = {
			name: name
		};

		var prefix = 'update/' + name;
		
		ipc.on(prefix + '/row_points', function(data) {
			playerDatas[name].row_points = data;
		});

		ipc.on(prefix + '/combo', function(data) {
			playerDatas[name].combo = data;
		});

		ipc.on(prefix + '/field', function(data) {
			playerDatas[name].field = data;
		});

		updatePlayer(name);
	});
});

ipc.on('settings/field_width', function(data) {
	settings.set('field_width', data);
});

ipc.on('settings/field_height', function(data) {
	settings.set('field_height', data);
});

ipc.on('update/game/next_piece_type', function(shape) {
	for(var name in playerDatas) {
		playerDatas[name].next_piece_type = shape;
	}
});

ipc.on('update/game/this_piece_type', function(shape) {
	for(var name in playerDatas) {
		playerDatas[name].this_piece_type = shape;
	}
});

ipc.on('update/game/this_piece_position', function(pos) {
	for(var name in playerDatas) {
		playerDatas[name].this_piece_position = pos;
	}
});

ipc.on('window/draw', function() {
	for (var name in playerDatas) {
		updatePlayer(name);
	}
});

function nextRoundClicked() {
	for (var name in playerDatas) {
		updatePlayer(name);
	}

	ipc.send('engine/next_round', null);
}

/* init */
ipc.send('engine/start', null);
