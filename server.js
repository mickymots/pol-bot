var fs = require('fs'),
    path = require('path'),
    Twit = require('twit'),
    config = require(path.join(__dirname, 'config.js'));

var T = new Twit(config);

T.post('statuses/update', { status: 'How @arvindkejriwal is changing face of education in delhi https://goo.gl/n6dvtm' }, function(err, data, response) {
  console.log(data)
});