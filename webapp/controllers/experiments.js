var secrets = require('../config/secrets');
var mongoose = require('mongoose');
var User = require('../models/User');

exports.getIndex = function(req, res) {
  if (! req.user) return res.redirect('/');
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);
    console.log("FOO");
    user.directMessages(function() {});

    res.render('experiments', {
      experiments: user.experiments
    });
  });
};

exports.getExperiment = function(req, res) {
  if (! req.user) return res.redirect('/');

  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    var expId = req.body.experiment;
    console.log(expId);

    Experiment.findById(expId, function(err, experiment) {
      if (err) return next(err);
      if (experiment.user != user.id) {
        return next("You do not own this experiment");
      }
      // Get the tweets from this experiment.
      Tweet.Tweet.find({
        experiment: experiment
      }, function(err, tweets) {
        if (err) return next(err);
        res.render('experiment', {
          experiment: experiment,
          tweets: tweets
        });
      });
    });
  });
};

exports.postCreate = function(req, res) {
  if (! req.user) return res.redirect('/');

  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);
  

    var experiment = {
      title: req.body.title || '',
      hashtag: req.body.hashtag || '',
      exampletweet: req.body.exampletweet || '',
    };

    user.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Experiment Created.' });
      res.redirect('/experiments');
    });

  });

};


