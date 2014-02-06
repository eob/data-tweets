var mongoose = require('mongoose');
var secrets = require('./config/secrets');

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});

var User = require('./models/user');

var query = User.find();

var tryit = function(user) {
  console.log("Trying " + user.profile.name);
  user.pullTweets();
};

query.exec(function (err, people) {
  if (err) {
    console.log("Error");
  }
  for (var i = 0; i < people.length; i++) {
    var person = people[i];
    console.log("- " + person.profile.name);
    if (person.profile.name == "DataBot") {
      tryit(person);
    }
  }
});


