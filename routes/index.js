var express = require('express');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter');
var router = express.Router();

router.get('/token', function(req, res, next) {
  if (req.user &&  req.user.token &&  req.user.tokenSecret) {
    var token = req.user.token;
    var tokenSecret = req.user.tokenSecret;
    res.render('token', {
      token: token,
      tokenSecret: tokenSecret
    });
  } else {
    res.redirect('/');
  }
  req.session.destroy();
  req.logout();
});

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/token');
  });

module.exports = router;
