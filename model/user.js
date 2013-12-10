var bcrypt = require('bcrypt-nodejs');

var Schema = {
  provider: String,
  uid: String,
  name: String,
  image: String,
  created: Date,
  email: String,
  username: String,
  password: String
};

var createModel = function(thinky){
  var x = thinky.createModel('User', Schema);

  x.define('saltAndHash', function(next) {
        var user = this;

        bcrypt.genSalt(10, function(err, salt) {
                if(err) return next(err);

                bcrypt.hash(user.password, salt, function(err, hash) {
                        if(err) return next(err);
                        user.password = hash;
                        next();
                });
        });
  });

  x.define('comparePassword', function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
                if(err) return cb(err);
                cb(null, isMatch);
        });
  });
};

module.exports = createModel;
