var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');

var experimentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, unique: true },
  exampletweet: { type: String },
  hashtag: { type: String }
});

