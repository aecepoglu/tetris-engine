var players = {};

var datas = {};

players.createPlayer = function(name) {
	datas[name] = {};
};

players.setPlayer = function(name, values) {
	for (var key in values) {
		datas[name][key] = values[key];
	}
};

players.setAllPlayers = function(values) {
	for (var name in datas) {
		players.setPlayer(name, values);
	}
};

players.getPlayer = function(playerName) {
	return datas[playerName];
};

module.exports = players;
