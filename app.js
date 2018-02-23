var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nconf = require('nconf');

var index = require('./routes/index');
var users = require('./routes/users');
var playlists = require('./routes/playlists');

var winston = require('winston');
var nunjucks = require('nunjucks');

var Deezer = new require('../real-deezer-api/lib/src/Deezer').Deezer;
var dz = new Deezer('nyh26a8w7cLdcl7YbIVIeor9j2GzGOdOs5cVpv5ZwOZ5HRebOQ');


nconf.argv({
  p: {
    alias: 'http:port',
    describe: 'The port to listen on'
  }
}); 

nconf.env('__');

nconf.file('config.json');

nconf.defaults({
  http: {
    port: 3000
 },
 'logger': {
   'fileLevel': 'error'
 }
});

winston.add(winston.transports.File, {filename: 'error.log', level: nconf.get('logger:fileLevel')});

var app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

winston.info('Initialized nconf');
winston.info('HTTP Config: ', nconf.get('http'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/playlists', playlists);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
