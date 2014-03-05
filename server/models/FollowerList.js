var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var secrets = require('../config/secrets');
var crypto = require('crypto');
var Q = require('q');
var User = require('./User');
var _ = require('underscore');
var Twit = require('twit');

var followerListSchema = new mongoose.Schema({
  lastSyncStatus: {type: String, default: "none yet"},
  nextCursor: {type: Number, default: -1},
  followers: [{ type: mongoose.Schema.Types.Mixed }],
  user: { type: mongoose.Schema.Types.ObjectId },
  lastChecked: { type: Date, default: null }
});

followerListSchema.methods.getNextPage = function(user) {
  var deferred = Q.defer();
  var self = this;
  user.followers(self.nextCursor, function(err, reply) {
    if (err) {
      console.log(err);
      deferred.reject(err);
    } else {
      if ((typeof reply.next_cursor != 'undefined') && (typeof reply.users != 'undefined')) {
        self.nextCursor = reply.next_cursor;
        self.lastSyncStatus = "Success";
        for (var i = 0; i < reply.users.length; i++) {
          self.followers.push(reply.users[i]);
        }
        console.log("followers of", self.followers.length);
        self.save(function(err) {
          if (err) {
            console.log("ERROR", err);
            deferred.reject(err);
          }
          return deferred.resolve();
        });
      } else {
        self.lastSyncStatus = "Undefined next cursur or users";
        self.save();
        deferred.reject("Undefined next cursor or users");
      }
    }
  });
  return deferred.promise;
};

module.exports = mongoose.model('FollowerList', followerListSchema);
