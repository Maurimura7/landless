// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User       		= require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport,request) {

	
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
      
            User.localAuth(email, password)
                .then(function (user) {
                  if (user) {
                   
                    req.session.user = user.email ;
                  
                    done(null, user);
                  }
                  if (!user) {
                   
                  return done(null, false, req.flash('loginMessage', 'Datos erroneos'));
                  }
              });
   
    }));

};
