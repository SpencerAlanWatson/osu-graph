var express = require("express");
var app = express();

var request = require("request");
var serverData = require('./data.json');
var lastRefresh;
var playerData;

app.set('port', (process.env.PORT || serverData.port));
app.use(express.static(__dirname + '/public'));

function updatePlayerData(playersList, callback) {
	var players = playersList,
		max = players.length,
		responses = [],
		completed = 0;

	function returnPlayerInfo(data) {
		playerData = data;
		callback(data);
	}

	function recievedPlayerInfoFactory(name) {
		return function recievedPlayerInfo(error, response, body) {
			var scores = JSON.parse(body),
				len = scores.length,
				convertedData = [];
			console.log(len);
			for (var i = 0; i < len; ++i) {
				var score = scores[i];
				convertedData.push(score.pp)
			}
			responses.push({
				name: name,
				data: convertedData,

			});
			if (++completed >= max) {
				returnPlayerInfo(responses);
			}
		}
	}
	for (var i = 0; i < max; ++i) {
		var playername = players[i];
		request(serverData.api.baseURL + "get_user_best?k=" + serverData.api.key + "&u=" + playername + "&limit=100", recievedPlayerInfoFactory(playername));
	}
}
app.get("/scores", function (req, res) {
	var diffTime = process.hrtime(lastRefresh);

	if (diffTime[1] >= serverData.refreshInterval) {
		lastRefresh = process.hrtime();
		console.log("Updating Player Data...");
		updatePlayerData(serverData.playerList, function (data) {
			res.json(data);
		});
	} else {
		res.json(playerData);
	}

});
console.log("Caching Player Data");
updatePlayerData(serverData.playerList, function (playerData) {
	console.log("Player data is finished caching, starting server.")
	app.listen(app.get('port'), function () {
		console.log('We\'re live!  Running hot on port ' + app.get('port') + '!');
	});
});