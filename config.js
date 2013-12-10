module.exports = {
  hostname: 'http://localhost:3000', //url app is running at (without trailing /)!!
  getEnv: function(db) { //get variables from environment or default to hardcoded variables when initalizing database clients
    if('redis'==db){
      if(process.env.REDISTOGO_URL) {
        var rtg   = require("url").parse(process.env.REDISTOGO_URL);
        var redis = require("redis").createClient(rtg.port, rtg.hostname);

        return {
          host: rtg.hostname,
          port: rtg.port,
          auth: rtg.auth.split(":")[1]);
        }
      } else {
        return {
          host: 'localhost',
          port: 6379
        }
      }
    }else{
      if(process.env.RETHINKDB_HOST) {
        return { host: process.env.RETHINKDB_HOST,
            port: process.env.RETHINKDB_PORT,
            authKey: process.env.RETHINKDB_AUTH };
      } else {
        return {
          host: 'localhost',
          port: 28015,
          db: 'MathJewled'
        }
      }
    }
  },
  redis: {
    createClient: function() { //create redis client
      var redis = require('redis');
      var client = redis.createClient(this.host, this.port, {auth_key: this.auth});

      return client;
    }
  },
  thinky: {
    createClient: function() { //create rethinkdb client
      var thinky = require('thinky');

      thinky.init({
        host: this.host,
        port: this.port,
        authKey: this.auth,
        db: this.db
      });

      return thinky;
    }
  }
}
