// Load the Visualization API and the corechart package.
google.charts.load('current', {
	'packages': ['corechart']
});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

	// Create the data table.
	var data = new google.visualization.DataTable();
	data.addColumn('number', 'Play');
	$.ajax("/scores", {
		data: {
			players: ["Rafis", "Cookiezi", "hvick225", "AngeLMegumin", "Vaxei"]
		},
		success: onDataSuccess
	});

	function onDataSuccess(response) {
		var playerData = response,
			len = playerData.length,
			rows = [];

		for (var i = 0; i < len; ++i) {
			var player = playerData[i];
			data.addColumn('number', player.name);
		}
		for (i = 0; i < len; ++i) {
			var player = playerData[i];
			var scores = player.data,
				scoresLen = scores.length;
			for (var scoreIndex = 0; scoreIndex < scoresLen; ++scoreIndex) {
				if (rows[scoreIndex]) {
					rows[scoreIndex].push(Number(scores[scoreIndex]));
				} else {
					rows[scoreIndex] = [scoreIndex + 1, Number(scores[scoreIndex])];
				}
			}
		}
		data.addRows(rows);

		// Set chart options
		var options = {
			'title': 'The Top Five Players\' Top Plays',
			'chartArea': {
				width: '800',
				height: '600'
			},
			'width': '100%',
			'height': '800',
			'vAxis': {
				'title': "Unweighted PP"
			},
			'hAxis': {
				'title': "Play position"
			},
			'pointSize': 5

		};

		// Instantiate and draw our chart, passing in some options.
		var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
		chart.draw(data, options);
	}
}