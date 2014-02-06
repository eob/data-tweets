var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Q = require('q');

var tweetSchema = new mongoose.Schema({
  twitterData: { type: mongoose.Schema.Types.Mixed },
  experiment: { type: mongoose.Schema.Types.ObjectId },
  user: { type: mongoose.Schema.Types.ObjectId },
  botHandle: { type: String },
  twitterId: { type: String },
  method: { type: String },
  received: { type: Date, default: Date.now },
  experimentName: { type: String, default: '' },
  participantHash: { type: String },
  parsedData: { type: mongoose.Schema.Types.Mixed },
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
  this.botHandle = twitterData.recipient.screen_name;
  this.method = method;
  this.twitterId = twitterData.id_str;
  var text = twitterData.text
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/^\s+|\s+$/g, ''); // Strip
  this.twitterData = twitterData;
  this.experimentName = this.experimentHashtagFromTweet(text);
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
  var words = text.split(' ');
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

var Tweet = mongoose.model('Tweet', tweetSchema);

var maybeRecord = function(tweet, method, user) {
  var deferred = Q.defer();

  // See if mongo already has one.
  Tweet.findOne({twitterId: tweet.id_str}, function(err, existingTweet) {
    if (err) { 
      deferred.reject(err);
    }
    if (existingTweet != null) {
      deferred.resolve(false);
    } else {
      // None existed.
      var t = new Tweet();
      t.twitterData = tweet;
      t.parseFrom(tweet, method);
      t.user = user.id;
      t.save(function(e, tw) {
        if (e) {
          deferred.reject(e);
        } else {
          deferred.resolve(true);
        }
      });
    }
  });
  return deferred.promise;
};

module.exports = {
  Tweet: Tweet,
  maybeRecord: maybeRecord
}
