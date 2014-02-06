var mongoose = require('mongoose');
var User = require('../models/User');
var moment = require('moment');

exports.getIndex = function(req, res) {
  if (! req.user) return res.redirect('/');
  var self = this;

  User.findById(req.user.id, function(err, user) {
    if (err) {
    } else {
      var syncStatus = 'Syncing';
      var offerSync = false;
      if ((! self.syncStatus) || (self.syncStatus != 'Syncing')) {
        syncStatus = 'Not Syncing';
        offerSync = true;
      }
      var data = {
        name: user.profile.name,
        lastSyncTime: moment(user.lastSyncTime).fromNow(),
        lastSyncStatus: user.lastSyncStatus,
        lastSyncHaul: user.lastSyncHaul,
        syncStatus: syncStatus,
        offerSync: offerSync
      };
      res.render('sync', data);
    }
  });
};

exports.postIndex = function(req, res) {
  if (! req.user) return res.redirect('/');
  var self = this;

  User.findById(req.user.id, function(err, user) {
    if (err) {
      console.log("Error 1", err);
    } else {
      if ((user.syncStatus) && (user.syncStatus == 'Syncing')) {
      } else {
        user.pullTweets();
      }
      res.redirect('/sync');
    }
  });
};

