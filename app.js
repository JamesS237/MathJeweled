
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http');

var config = require('./config');

var RedisClient = config.redis.createClient.call(config.getEnv('redis')),
    RedisStore = require('connect-redis')(express);

var app = express(),
    route = require('./route');

var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy,
    LocalStrategy = require('passport-local').Strategy,
    keys = require('./passport');


var RethinkClient = config.thinky.createClient.call(config.getEnv('thinky')),
    User = require('./model/user')(RethinkClient);

var uuid = require('node-uuid');

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session({ store: new RedisStore({client:RedisClient}), secret: 'keyboard cat' })));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('./public'));
app.use(app.router);
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*
 * Passport Authentication Strategys
 */

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.execute({ uid: uid }, function (err, user) {
    done(err, user);
  });
});

//Twitter
passport.use(new TwitterStrategy({
    consumerKey: keys.twitter.consumerKey,
    consumerSecret: keys.twitter.consumerSecret,
    callbackURL: config.hostname + "/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.execute({uid: profile.id}, function(err, user) {
      if(user) {
        //user already exists, so just return their profile
        done(null, user);
      } else {
        //this is a new user! such user. very new. excite. wow.
        //so....
        //lets put togther their profile to save
        var user = {};
        user.provider = "twitter";
        user.uid = profile.id;
        user.name = profile.displayName;
        user.image = profile._json.profile_image_url;
        user.email = profile.emails[0];

        //turns the above into thinky model
        var userModel = new User(user);
        userModel.save({saveJoin: true},function(err) {
          if(err) {
            //shit.
            throw err;
          };
          //now that they're saved, just return their profile;
          done(null, user);
        });
      }
    });
  }
));

//Facebook
passport.use(new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: config.hostname + "/auth/facebook/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.execute({uid: profile.id}, function(err, user) {
      if(user) {
        //user already exists, so just return their profile
        done(null, user);
      } else {
        //this is a new user! such user. very new. excite. wow.
        //so....
        //lets put togther their profile to save
        var user = {};
        user.provider = "facebook";
        user.uid = profile.id;
        user.name = profile.displayName;
        user.image = profile._json.profile_image_url;
        user.email = profile.emails[0];

        //turns the above into thinky model
        var userModel = new User(user);
        userModel.save({saveJoin: true},function(err) {
          if(err) {
            //shit.
            throw err;
          };
          //now that they're saved, just return their profile;
          done(null, user);
        });
      }
    });
  }
));

//Local
passport.use(new LocalStrategy(function(username, password, done) {
  User.execute({ username: username }, function(err, user) { //find users with username : username
    if (err) { return done(err); } //error handling
    if (!user) { return done(null, false, { message: 'Unknown user ' + username }); } //error handling

    user.comparePassword(password, function(err, isMatch) { //compare candiate password
      if (err) return done(err); //error handling
      if(isMatch) {
        return done(null, user); //return user
      } else {
        return done(null, false, { message: 'Invalid password' }); //error handling
      }
    });
  });
}));



/*
 * Routes
 */

//application
app.get('/', route.index);

/*
 * User
 */

//Twitter
app.get('/auth/twitter', passport.authenticate('twitter'), function(req, res){
  // The request will be redirected to Twitter for authentication, so this function will not be called.
});
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/'); //redirect to home

});

//Facebook
app.get('/auth/facebook', passport.authenticate('facebook'), function(req, res){
  // The request will be redirected to Facebook for authentication, so this function will not be called.
});
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function(req, res) {
  res.redirect('/'); //redirect to home
});

//Local
app.get('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return res.jsonp({success: false, error: err.message, state: 'loggedout'}); }
    if (!user) { return res.jsonp({success: false, error: 'user not found', state: 'loggedout'}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.jsonp({success: true, error: false, state: 'loggedin'});
    });
  })(req, res, next);
});

//All

app.post('/register', route.register);

app.get('/logout', function(req, res){
  req.logout(); //logout
  res.jsonp({success: true, error: false, state: 'loggedout'}); //response
 });

/*
 * API
 */
app.get('/api/highscores/:start/:stop', route.api.highscores.get);
app.post('/api/highscores', route.api.highscores.create);
app.get('/api/highscores/rank', route.api.highscores.create);


http.createServer(app).listen(app.get('port'), function(){ //create server instance from app
  console.log('Express server listening on port ' + app.get('port'));
});
