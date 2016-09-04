var JwtStrategy = require('passport-jwt').Strategy, 
ExtractJwt = require('passport-jwt').ExtractJwt;

var config = require('../config/database'); // get db config file
var User = require('../models/user');

module.exports = function(passport) {
	
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;
  
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
	
    User.findOne({name: jwt_payload.name}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
    
  }));
  
};