var config = require('./config');

var RethinkClient = config.thinky.createClient.call(config.getEnv('thinky')),
    User = require('./model/user')(RethinkClient);

var uuid = require('node-uuid');

function placekitten()
{
    var from = 256,
        to = 1024;
    var num = Math.floor(Math.random()*(to-from+1)+from);

    return "http://placekitten.com/" + num + "/" + num;
}

module.exports = {
  index: function(req, res){
    res.sendFile('../public/index.html');
  },
  register: function(req, res) {
    var user = new User({
      provider: "local".
      uid: uuid.v4(),
      name: req.body.name,
      image: placekitten(),
      created: new Date(),
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });

    user.saltAndHash();

    user.save(function(err, r) {
      if(err) {
        return res.jsonp({success: false, error: err.message, state: req.user ? 'loggedin' : 'loggedout'});
      }
      return res.jsonp({success: true, error: false, state: req.user ? 'loggedin' : 'loggedout'});
    });
  },
  api: require('./api')
};
