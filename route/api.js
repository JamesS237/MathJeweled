var config = require('./config');

var redis = config.redis.createClient.call(config.getEnv('redis')); //import redis client

var RethinkClient = config.thinky.createClient.call(config.getEnv('thinky')), //import rethinkdb client
    User = require('./model/user')(RethinkClient); //require user model<D-d>

module.exports = {
  highscores: Highscores //export the following highscores thingy magig
};

var Highscores = {
  create: function(req, res){
    redis.zscore('highscores', res.user.uid, function(err, reply) { //get score
      if(err) {
        //this user hasn't entered a highscore before, so let's do that and make
        //their day :)

        redis.zadd('highscores', req.body.score, req.user.uid, function(err, reply) { //add highscore
          if (err) { return res.jsonp({success: false, error: err.message, state: 'loggedin'}); } //error handling

          res.jsonp({success: true, error: false, state: 'loggedin'}); //response
        })
      } else {
        //this user has a highscore on the leaderboard. let's see
        //if they have improved on their score!
        //
        //We'll only update their score if the new score > previous score

        if(req.body.score > reply) { //if they got a better score
          redis.zrem('highscores', req.user.uid, function(err, reply) { //remove last highscore
            if (err) { return res.jsonp({success: false, error: err.message, state: 'loggedin'}); } //error handling

            redis.zadd('highscores', req.body.score, req.user.uid, function(err, reply) { //add new highscore
              if (err) { return res.jsonp({success: false, error: err.message, state: 'loggedin'}); } //error handling

              res.jsonp({success: true, error: false, state: 'loggedin'}); //response
             });
          });
        } else { //not a better score :/
          res.jsonp({success: true, error: false, state: 'loggedin'}); //response
        }
      }
    })
  },
  get: function(req, res) {
    redis.zrevrange('highscores', Number(req.param('start')), req.param('stop')<250 ? Number(req.param('stop')) : 250, function(err, reply) {//get ranks in global leaderboard between the provided start and stop numbers (high to low (eg. best == 1st)

      if (err) { return res.jsonp({success: false, error: err.message, state: 'loggedin'}); } //error handling
      var leaderboard = [];

      reply.forEach(function(x, i) {
        User.execute({uid:x}, function(err, reply) {
          if (err) { return res.jsonp({success: false, error: err.message, state: 'loggedin'}); } //error handling

          leaderboard[i] = {name:x,image:reply.image,rank:i};
        })
      });

      res.jsonp({start:req.param('start'), stop:req.param('stop'), leaderboard:leaderboard});
    })
  },
  rank: function(req, res) {
    redis.zrevrank('highscores', req.user.uid, function(err, reply) { //get rank in global leaderboard (high to low (eg. best == 1st)
      if(err) { return res.jsonp({rank:0}) }
      res.jsonp({rank:reply || 0});
    });
  }
};
