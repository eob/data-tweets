var Twit = require('twit');
var secrets = require('./config/secrets');
var _ = require('./config/secrets');

var uname = 'jenny8lee';
var token = _.findWhere(this.tokens, { kind: 'twitter' });
var T = new Twit({
  consumer_key: secrets.twitter.consumerKey,
  consumer_secret: secrets.twitter.consumerSecret,
  access_token: token.accessToken,
  access_token_secret: token.tokenSecret
});

T.get('followers/ids', {'user_id': uname}, function (err, reply) {
  if (err) {
    return cb(err);
  }
  console.log(reply);
  var s = JSON.stringify(reply);
  fs.writeSync('jenny_follower_ids.json', s);
});

