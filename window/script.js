var ipc = require('ipc');
var React = require('react');
var ReactDOM = require('react-dom');

var RoundIndicator = require('./modules/round-indicator');
var Player = require('./modules/player');

var playerDatas = {};

ipc.on('update/game/round', function(data) {
	ReactDOM.render(
		React.createElement(RoundIndicator, {roundNo: data}),
		document.getElementById('roundLabel')
	);
});

ipc.on('settings/player_name', function(names) {
	names.each(function(name) {
		playerDatas[name] = {};

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
	});
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
