var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var readline = require('readline');

require('crash-reporter').start();

var mainWindow = null;

function sendMsg(topic, payload) {
	mainWindow.webContents.send(topic, payload);
}

var stdio = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

function generateRandomMap() {
	var result = [];

	for (var row=0; row<20; row++) {
		var cols = [];

		for (var col=0; col<10; col++) {
			cols[col] = Math.floor(Math.random() * 2);
		}

		result[row] = cols;
	}

	return result;
}

function getRandomShape() {
	var shapes = ['O', 'I', 'L', 'J', 'S', 'Z', 'T'];

	return shapes[Math.floor( Math.random() * (shapes.length - 1) )];
}

var roundNo = 0;
var nextShape = getRandomShape();


function nextRound() {
	roundNo ++;

	var map = generateRandomMap();

	sendMsg('update/game/round', roundNo);
	sendMsg('update/game/this_piece_type', nextShape);
	sendMsg('update/game/next_piece_type', getRandomShape());
	sendMsg('update/game/this_piece_position', {i: 4, j: -1});

	sendMsg('update/myBot/row_points', 0);
	sendMsg('update/myBot/combo', 0);
	sendMsg('update/myBot/field', map);

	sendMsg('update/opponent1/row_points', 0);
	sendMsg('update/opponent1/combo', 0);
	sendMsg('update/opponent1/field', map);

	/*TODO ask to bot through stdout for action*/
}

function initEngine() {
	sendMsg('settings/timebank', 10000);
	sendMsg('settings/time_per_move', 1);
	sendMsg('settings/player_names', ['myBot']);
	sendMsg('settings/your_bot', 'myBot');
	sendMsg('settings/field_width', 10);
	sendMsg('settings/field_height', 20);

	nextRound();

	sendMsg('window/draw', null);
}

stdio.on('line', function(line) {
	//TODO it will read commands in the form of "left left drop"
});

ipc.on('engine/start', function() {
	initEngine();
});

ipc.on('engine/next_round', function() {
	nextRound();
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({width: 640, height: 480});

	mainWindow.loadUrl('file://' + __dirname + '/public/index.html');

	mainWindow.openDevTools();

	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});
