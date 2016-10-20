var fs = require('fs'),
path = require('path'),
Twit = require('twit'),
config = require(path.join(__dirname, 'config.js'));

var T = new Twit(config);

var tweetDB = []
var scheduledTweetsDB = []

//sends out a text tweet
function postTweet() {

	var postTweetText = scheduledTweetsDB.pop()

		if (tweetDB.length >= 100) {
			tweetDB = []
		}

		T.post('statuses/update', {
			status : postTweetText
		}, function (err, data, response) {
			console.log(data);
		});

	tweetDB.push(postTweetText)

	console.log("[ Tweet Posted ] = " + postTweetText)

}

function scheduleTweet(scheduleTweetText) {

	if (scheduledTweetsDB.indexOf(scheduleTweetText) > -1) {

		console.log('[Removed duplicate tweet] = ' + scheduleTweetText + ' : ' + tweetDB.indexOf(scheduleTweetText));

	} else {
		console.log("[Scheduled Tweet] = " + scheduleTweetText)
		scheduledTweetsDB.push(scheduleTweetText)

	}

}

//Search through the tweets for a given user and responds a fixed text message
function showQuery(searchText, message) {

	T.get('search/tweets', {
		q : searchText,
		count : 5
	}, function (err, data, response) {

		var mentionArray = [];
		statuses = data.statuses

			if (statuses) {
				for (i = 0; i < statuses.length; i++) {
					
					var tweetText = ''
					jsonStatusData = statuses[i]

					if (jsonStatusData.text.toUpperCase().indexOf("ARMY")> -1){
						
						tweetText = jsonStatusData.text.toUpperCase()
						if(tweetText.indexOf("RT") == -1)
						tweetText = 'RT ' +  jsonStatusData.text
						else 
						scheduleTweet(tweetText)
					} 
					
					if(jsonStatusData.text.toUpperCase().indexOf("KARAN") || jsonStatusData.text.toUpperCase().indexOf("ARNAB")) {
							//console.log(jsonStatusData.text);

							var result = jsonStatusData.text.split(" ");
							
							/*
							//Below code appends the twitter users in a tweet
							var k = 0;
							for (j = 0; j < result.length; j++) {

								if (result[j].charAt(0) == '@') {
									//console.log('Mentions = ' + result[j]);
									mentionArray[k] = result[j];
									k = k + 1;

								}

							}
							*/

							var addMessage = true
								
								for (l = 0; l < mentionArray.length; l++) {
									tweetText += mentionArray[l] + " "

									if (l == randomizer()) {
										addMessage = false;
										tweetText += message[0] + " "
									}

								}

								if (addMessage) {
									tweetText += message[1]
								}
								if (tweetText.length > 140) {

									scheduleTweet(tweetText.substring(0, 135) + ' 1/2')
									scheduleTweet(tweetText.substring(136) + ' 2/2')
								} else {

									scheduleTweet(tweetText)
								}
						}

				}
			}

	});

}

function randomizer() {

	return Math.floor(Math.random() * 10);

}

function showRandomValues() {

	for (i = 0; i < 20; i++) {

		console.log(randomizer());
	}
}

var db =
	[{
		'searchText' : '#ADHM',
		'messages' : ['#Arts and #Sports are not restricted by any boudaries', 'Eagerly waiting for #ADHM']

	}, {
		'searchText' : '@thenewshour',
		'messages' : ['Yes, India want debate but not from a newsroom. More like #BarkhaDutt and #RajdeepSardesai', '#BJP torning secular fabric of India in most disguised way. Just mold a question in another question. #bravo']
	}, {
		'searchText' : '#BJP',
		'messages' : ['~BJP shame on such leaders. only to milk nation and fool millions on #patriotism', 'People like #AmitShah, #TiharReturn is your party chief and you talk about being nationalist.']
	}

];

function pickRandomSearchText() {

	//var lastValue = 0;

	for (i = 0; i < db.length; i++) {
		showQuery(db[i].searchText, db[i].messages);
	}

	setInterval(sendScheduledTweets, 60000)

	//sendScheduledTweets();
}

function sendScheduledTweets() {

	if (scheduledTweetsDB.length > 0) {
		console.log('---something to tweet ---')
		for (i = 0; i < scheduledTweetsDB.length; i++) {
			setTimeout(postTweet, randomizer() * 2000, '--- tweet posted ---')
		}
	} else
		console.log('-------- Nothing to Tweet --------')
}

setInterval(pickRandomSearchText, 120000);