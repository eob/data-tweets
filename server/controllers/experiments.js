var secrets = require('../config/secrets');
var mongoose = require('mongoose');
var User = require('../models/User');
var Experiment = require('../models/Experiment');
var Tweet = require('../models/Tweet');
var _ = require('underscore');

exports.getIndex = function(req, res) {
  if (! req.user) return res.redirect('/');
  User.findById(req.user.id, function(err, user) {
    if (err) {
      console.log(err);
      return;
    }

    Experiment.find({user: user.id}, function(err, experiments) {
      if (err) {
        console.log(err);
        return;
      }
      var data = {};
      if (experiments.length > 0) {
        data['experiments'] = _.map(experiments, function(e) {
          return {name: e.name, link: '/experiment/' + e.hashtag};
        });
      }
      res.render('experiments', data);
    });
  });
};

exports.getExperiment = function(req, res) {
  if (! req.user) return res.redirect('/');

  var returnError = function(msg) {
  };

  User.findById(req.user.id, function(err, user) {
    if (err) return returnError(err);

    var expId = req.params.experiment;

    var query = {
      user: user.id
    };
    var name = null;

    if (expId == '__default') {
      query.experimentName = '';
      name = 'Default';
    } else if (expId == '__all') {
      name = 'All';
    } else {
      query.experimentName = expId;
      name = '#' + expId;
    }
    console.log(query);

    // Get the tweets from this experiment.
    Tweet.Tweet.find(query, function(err, tweets) {
      console.log(tweets);
      if (err) return returnError(err);
      res.render('experiment', {
        name: name,
        hash: expId,
        tweets: tweets
      });
    });
  });
};

exports.postCreate = function(req, res) {
  if (! req.user) return res.redirect('/');

  User.findById(req.user.id, function(err, user) {
    if (err) {
      console.log(err);
      return;
    }

    var data = {
      name: req.body.name || '',
      hashtag: req.body.hashtag || '',
      exampletweet: req.body.exampletweet || '',
      user: user.id
    };

    var experiment = new Experiment(data);

    experiment.save(function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Experiment Created.' });
      res.redirect('/experiments');
    });

  });

};


