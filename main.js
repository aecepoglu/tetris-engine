var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var readline = require('readline');

require('crash-reporter').start();

var mainWindow = null;

app.on('ready', function() {
	mainWindow = new BrowserWindow({width: 640, height: 480});

	mainWindow.loadUrl('file://' + __dirname + '/public/index.html');

	mainWindow.openDevTools();

	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});

function sendMsg(topic, payload) {
	mainWindow.webContents.send(topic, payload);
}

ipc.on('ping', function(ev, arg) {
	console.log('ev: ' + ev);
	console.log('arg: ' + arg);

	ev.sender.send('update/game/round', 17);
	sendMsg();
});

var stdio = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

stdio.on('line', function(line) {
	if(line == 'start') {
		var map = [
			[0,0,0,0,1,1,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0]
		];

		sendMsg('settings/timebank', 10000);
		sendMsg('settings/time_pier_move', 1);
		sendMsg('settings/player_names', ['myBot', 'opponent1']);
		sendMsg('settings/your_bot', 'myBot');
		sendMsg('settings/field_width', 10);
		sendMsg('settings/field_height', 20);

		sendMsg('update/game/round', 1);
		sendMsg('update/game/this_piece_type', 'L');
		sendMsg('update/game/next_piece_type', 'O');
		sendMsg('update/game/this_piece_position', {i: 4, j: -1});

		sendMsg('update/myBot/row_points', 0);
		sendMsg('update/myBot/combo', 0);
		sendMsg('update/myBot/field', map);
		
		sendMsg('update/opponent1/row_points', 0);
		sendMsg('update/opponent1/combo', 0);
		sendMsg('update/opponent1/field', map);
	}
});
