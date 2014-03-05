var mongoose = require('mongoose');
var secrets = require('../config/secrets');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Twit = require('twit');
var Tweet = require('./Tweet');
var _ = require('underscore');
var Q = require('q');

var userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,

  facebook: { type: String, unique: true, sparse: true },
  twitter: { type: String, unique: true, sparse: true },
  google: { type: String, unique: true, sparse: true },
  github: { type: String, unique: true, sparse: true },
  syncStatus: { type: String, default: "Not Syncing" },
  lastSyncStatus: { type: String, default: "" },
  lastSyncHaul: { type: Number, default: 0},
  lastSyncTime: { type: Date, default: null},
  tokens: Array,
  profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
  }
});

/**
 * Hash the password for security.
 */

userSchema.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/**
 *  Get a URL to a user's Gravatar email.
 */

userSchema.methods.gravatar = function(size, defaults) {
  if (!size) size = 200;
  if (!defaults) defaults = 'retro';
  var md5 = crypto.createHash('md5');
  md5.update(this.email);
  return 'https://gravatar.com/avatar/' + md5.digest('hex').toString() + '?s=' + size + '&d=' + defaults;
};

userSchema.methods.directMessages = function(cb) {
  var token = _.findWhere(this.tokens, { kind: 'twitter' });
  var T = new Twit({
    consumer_key: secrets.twitter.consumerKey,
    consumer_secret: secrets.twitter.consumerSecret,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  T.get('direct_messages', function (err, reply) {
    if (err) {
      return cb(err);
    }
    cb(null, reply);
  });
};

userSchema.methods.followers = function(page, cb) {
  var token = _.findWhere(this.tokens, { kind: 'twitter' });
  var T = new Twit({
    consumer_key: secrets.twitter.consumerKey,
    consumer_secret: secrets.twitter.consumerSecret,
    access_token: token.accessToken,
    access_token_secret: token.tokenSecret
  });
  T.get('followers/list',
        {cursor: page,
         count: 200,
         skip_status: 1,
         include_user_entities: true}, cb);
};



userSchema.methods.pullTweets = function() {
  var self = this;
  if (this.syncStatus != "Syncing") {
    this.syncStatus = "Syncing";
    this.lastSyncTime = Date.now;
    this.save();
  
    this.directMessages(function(err, messages) {
      var promises = _.map(messages, function(m) {
        return Tweet.maybeRecord(m, 'dm', self);
      });
      Q.all(promises).then(
        function(results) {
          var count = 0;
          for (var i = 0; i < results.length; i++) {
            if (results[i]) {
              count += 1;
            }
          }
          self.lastSyncHaul = count;
          self.syncStatus = "Not Syncing";
          self.lastSyncStatus = "Success";
          self.save();
        },
        function(err) {
          self.syncStatus = "Not Syncing";
          self.lastSyncStatus = "Error";
          self.save();
        }
      );
    });
  }
};

module.exports = mongoose.model('User', userSchema);
