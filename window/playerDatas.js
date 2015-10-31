var players = {
	_data: {}
};

players.createPlayer = function(name) {
	players._data[name] = {};
};

players.setPlayer = function(playerName, key, value) {
	players._data[playerName][key] = value;
};

players.setAllPlayers = function(key, value) {
	for (var playerName in players._data) {
		players._data[playerName][key] = value;
	}
};

players.getPlayer = function(playerName) {
	return players._data[playerName];
};

players.forEach = function(callback) {
	for (var playerName in players._data) {
		callback(players._data[playerName], playerName);
	}
};

module.exports = players;
