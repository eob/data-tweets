var mongoose = require('mongoose');
var secrets = require('./config/secrets');


mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('✗ MongoDB Connection Error. Please make sure MongoDB is running.');
});

var User = require('./models/User');
var FollowerList = require('./models/followerList');

//var name = "Ted Benson";
var name = "Jennifer 8. Lee";

var doit = function() {
  var tryit = function(user) {
    FollowerList.find({user: user}, function(err, followerList) {
      if (err) {
      } else if (followerList == []) {
      } else {
        followerList = followerList[0];
        followerList.getNextPage(user);
      }
    });
  };
  
  var query = User.find();
  query.exec(function (err, people) {
    if (err) {
      console.log("Error");
    }
    for (var i = 0; i < people.length; i++) {
      var person = people[i];
      console.log("- " + person.profile.name);
      if (person.profile.name == name) {
        tryit(person);
      }
    }
  });
};

setInterval(doit, 300000);
