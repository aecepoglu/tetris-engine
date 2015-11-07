var ipc = require('ipc');
var React = require('react');
var ReactDOM = require('react-dom');

var RoundIndicator = require('./modules/round-indicator');
var Player = require('./modules/player');
var settings = require('./settings');
var playerDatas = require('./playerDatas');

ipc.on('update/game/round', function(data) {
	ReactDOM.render(
		React.createElement(RoundIndicator, {roundNo: data}),
		document.getElementById('roundLabel')
	);
});

function drawPlayer(name) {
	ReactDOM.render(
		React.createElement(Player, playerDatas.getPlayer(name)),
		document.getElementById(name + '-container')
	);
};

ipc.on('cmd/settings', function(values) {
	settings.set('field_width', values.field_size.width);
	settings.set('field_height', values.field_size.height);

	values.player_names.forEach(function(name) {
		playerDatas.createPlayer(name);
	});

	console.log('settings set');
});

ipc.on('cmd/update', function(values) {
	if (values.common) {
		playerDatas.setAllPlayers(values.common);
	}

	for (var name in values.players) {
		playerDatas.setPlayer(name, values.players[name]);
		drawPlayer(name);
	}
});

function nextRoundClicked() {
	ipc.send('engine/next_round', null);
};

function nextFrameClicked() {
	ipc.send('engine/next_frame', null);
}

/* init */
ipc.send('engine/start', null);
