var mongoose = require('mongoose');
var User = require('../models/User');
var FollowerList = require('../models/FollowerList');
var moment = require('moment');

exports.getIndex = function(req, res) {
  if (! req.user) return res.redirect('/');
  var self = this;

  var good = function(user, followerList) {
    var offerSync = true;
    var lastSync = "Never";
    if (followerList.lastChecked != null) {
      lastSync = moment(followerList.lastChecked).fromNow();
    }
    var laststatus = followerList.lastSyncStatus;
    if (followerList.nextCursor = 0) {
      laststatus = "-----DONE----";
    }

    var data = {
      title: 'Jenny',
      name: user.profile.name,
      thecount: followerList.length,
      followers: followerList.followers.sort(
        function(a, b) { return b.followers_count - a.followers_count }),
      lastSyncTime: lastSync,
      lastSyncStatus: laststatus,
      offerSync: offerSync
    };
    res.render('followers', data);
  };

  User.findById(req.user.id, function(err, user) {
    if (err) {
    } else {
      FollowerList.find({user: user}, function(err, followerList) {
        if (err) {
          render(err);
        } else {
          if (followerList.length == 0) {
            followerList = new FollowerList({user: user});
            followerList.save(function(err, fl) {
              if (err) {
                render(err);
              } else {
                good(user, fl);
              }
            });
          } else {
            good(user, followerList[0]);
          }
        }
      });
    }
  });
};

exports.postIndex = function(req, res) {
  if (! req.user) return res.redirect('/');
  var self = this;

  User.findById(req.user.id, function(err, user) {
    if (err) {
    } else {
      FollowerList.find({user: user}, function(err, followerList) {
        if (err) {
        } else {
          followerList = followerList[0];
          followerList.getNextPage(user);
        }
      });
    }
  });
  res.redirect('/jenny');
};

