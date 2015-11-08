var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var readline = require('readline');

var map = require('./map');

require('crash-reporter').start();

var mainWindow = null;

var roundNo = 0;
var nextShape;
var movesQueue = [];
var score = {points: 0, combo: 0, skip: 0};

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

function nextRound() {
	roundNo ++;

	var curShape = nextShape;
	nextShape = getRandomShape();

	var clear = map.startRound(curShape);

	if (clear) {
		score.points += clear.points + score.combo;
		
		if (clear.combo) {
			score.combo ++;
		}
	}
	else {
		score.combo = 0;
	}

	sendMsg('cmd/update', {
		common: {
			round: roundNo,
			this_piece_type: curShape,
			next_piece_type: nextShape
		},
		players: {
			myBot: {
				row_points: score.points,
				combo: score.combo,
				skip: score.skip,
				field: map.getField()
			}
		}
	});

	console.log("pretend I'm asking for the next round");
}

function nextStep() {
	var move = movesQueue.shift();

	if (move === undefined && map.isRoundOver()) {
		nextRound();
	}
	else {
		map.doMove(move || 'down');

		sendMsg('cmd/update', {
			players: {
				myBot: {
					field: map.getField()
				}
			}
		});
	}
}

function initEngine() {
	var size = {width: 10, height: 20};
	nextShape = getRandomShape();

	sendMsg('cmd/settings', {
		timebank: 10000,
		time_per_move: 1,
		player_names: ['myBot'],
		field_size: size
	});

	map.init(size);

	nextRound();
}

stdio.on('line', function(line) {
	movesQueue = line.split(' ');
});

ipc.on('engine/start', function() {
	initEngine();
});

ipc.on('engine/next_round', function() {
	//TODO
});

ipc.on('engine/next_frame', function() {
	nextStep();
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({width: 640, height: 480});

	mainWindow.loadUrl('file://' + __dirname + '/public/index.html');

	mainWindow.openDevTools();

	mainWindow.on('closed', function() {
		mainWindow = null;
	});
});
