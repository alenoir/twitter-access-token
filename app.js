var express = require('express');
var session = require('express-session')
var passport = require('passport');
var TwitterStrategy = require('passport-twitter');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

app.use(session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  var consumer_key = req.session.consumer_key || req.query.consumer_key;
  var consumer_secret = req.session.consumer_secret || req.query.consumer_secret;

  if (consumer_key && consumer_secret) {
    req.session.consumer_key = consumer_key;
    req.session.consumer_secret = consumer_secret;

    passport.use(new TwitterStrategy(
      {
        consumerKey: consumer_key,
        consumerSecret: consumer_secret,
        callbackURL: "http://127.0.0.1:4000/auth/twitter/callback"
      },
      function(token, tokenSecret, profile, cb) {
        profile.token = token;
        profile.tokenSecret = tokenSecret;

        cb(null, profile)
      }
    ));
  }
  next();
});

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
