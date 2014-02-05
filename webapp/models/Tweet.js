var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var tweetSchema = new mongoose.Schema({
  twitterData: { type: mongoose.Schema.Types.Mixed },
  experiment: { type: mongoose.Schema.Types.ObjectId },
  botHandle: { type: String },
  method: { type: String },
  received: { type: Date, default: Date.now },
  experimentName: { type: String },
  participantHash: { type: String },
  parsedData: { type: String },
  parsedTags: [{ type: String }]
});

// Compute the user hash
tweetSchema.pre('save', function(next) {
  var tweet = this;
  var SALT_FACTOR = 5;

  if (!tweet.isModified('twitterData')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);
    var userName = tweet.twitterData.sender_screen_name;
    bcrypt.hash(userName, salt, null, function(err, hash) {
      if (err) return next(err);
      tweet.participantHash = hash;
      next();
    });
  });
});

tweetSchema.methods.parseFrom = function(twitterData, method) {
  this.twitterData = twitterData;
  this.botHandle = twitterData.recipient.screen_name;
  this.method = method;
  this.twitterId = twitterData.id_str;
  var text = twitterData.text
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/^\s+|\s+$/g, ''); // Strip
  this.experimentHashtag = this.experimentHashtagFromTweet(text);
  this.parsedData = this.keyValuesFromTweet(text);
  this.parsedTags = this.tagsFromTweet(text);
};

tweetSchema.methods.experimentHashtagFromTweet = function(text) {
  if ((text.length > 1) && (text[0] == '#')) {
    var i = 0;
    while ((i < text.length) && (text[i] != ' ')) {
      i++;
    }
    return text.substring(1, i);
  } else {
    return '';
  }
};

tweetSchema.methods.tagsFromTweet = function(text) {
  var inTag = false;
  var ret = [];
  var start = 0;
  var pop = function(start, finish) {
    ret.push(text.substring(start, finish));
  };
  for (i = 0; i < text.length; i++) {
    if (text[i] == '#') {
      if (inTag) {
        pop(start, i);
      }
      inTag = true;
      start = i+1;
    } else if ((text[i] == ' ') && inTag) {
      pop(start, i);
      inTag = false;
    }
  }
  if (inTag) {
    pop(start, text.length);
  }
  return ret;
};

tweetSchema.methods.keyValuesFromTweet = function(text) {
  var words = tweet.split(' ');
  var ret = {};
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    if ((word.length > 0) && (word[0] != '#')) {
      if (word.indexOf(':') > -1) {
        var kv = word.split(':');
        var k = kv.shift();
        var v = kv.join(":");
        ret[k] = v;
      }
    }
  }
  return ret;
};

var maybeRecord = function(tweet, method, user) {
  // TODO
};

module.exports = {
  Tweet: mongoose.model('Tweet', tweetSchema),
  maybeRecord: maybeRecord
}
