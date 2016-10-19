var fs = require('fs'),
path = require('path'),
Twit = require('twit'),
config = require(path.join(__dirname, 'config.js'));

var T = new Twit(config);

function postTweet(tweetText) {

	T.post('statuses/update', {
		status : tweetText
	}, function (err, data, response) {
		console.log(data);
	});

}

function showQuery() {

	T.get('search/tweets', {
		q : '@narendramodi',
		count : 5
	}, function (err, data, response) {

		var mentionArray = [];
		statuses = data.statuses

			if (statuses) {
				for (i = 0; i < statuses.length; i++) {
					jsonStatusData = statuses[i]

						if (jsonStatusData.text.toUpperCase().indexOf("SURGICAL")) {
							console.log(jsonStatusData.text);

							var result = jsonStatusData.text.split(" ");
							var k = 0;
							for (j = 0; j < result.length; j++) {

								if (result[j].charAt(0) == '@') {
									console.log('Mentions = ' + result[j]);
									mentionArray[k] = result[j];
									k = k + 1;

								}

							}
							
							var tweetText = 'Don\'t play with soldier\'s life '
							for(l = 0; l <mentionArray.length ; l++)
							{ tweetText += mentionArray[l] + " " 
							
								}
							
							postTweet(tweetText)
						}

				}
			}

	});

}

setInterval(showQuery, 5000);