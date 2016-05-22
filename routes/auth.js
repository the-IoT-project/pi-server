var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var jwt = require('jsonwebtoken');

var env = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  passReqToCallback: true
}

function Users() {
  return knex('users');
}
passport.use(new GoogleStrategy(
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
    // passReqToCallback: true
  },
  function(token, tokenSecret, profile, done) {
    var user = profile.emails[0].value;


      Users().where('email', user).select().first().then(function(hasUser) {
        console.log(user);
        if (!hasUser) {
          console.log("no user");
          Users().insert({
            pi_id: null,
            email: user
          }).then(function() {
            done(null,user);
          })
        } else {
          done(null,user);
        }
      })
  }
));

  router.get('/google/callback', function(req, res, next) {
    passport.authenticate('google', function(err, user, info) {
      if (err) {
        next(err);
      } else if (user) {
        console.log('User = '+user);


        // res.setHeader('x-token',token);
        var token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn:15778463
      });
      // set the authURL once front end is deployed
        // var authUrl = 'https://brewsbrotherschillerfrontend.firebaseapp.com/#/authenticate/'+token;
        res.redirect(authUrl);

      } else if (info) {
        next(info);
      }
    })(req, res, next);
  });

  router.get('/google', passport.authenticate('google', {
      // scope: 'profile'
      scope: 'email'
    }),
    function(req, res) {
      // The request will be redirected to Google for authentication, so this
      // function will not be called.

      res.end('success')
    });

    router.get('/logout', function(req, res, next){
      req.logout();
      res.send('logged out')
    })

function setToken(user, res) {
  var token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn:15778463
  })
  // res.setHeader('x-token',token);
  var authUrl = 'http://localhost:8080/#/authenticate/'+token;

}

module.exports = {
  router: router,
  passport: passport
}
