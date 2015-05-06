var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./server/routes/index');
var passport = require('passport');
var rethinkConfig = require('./server/config/rethink');
var thinky = require('thinky')(rethinkConfig);
var r = thinky.r;
require('./server/models/Posts');
require('./server/models/Comments');
require('./server/models/Users');
require('./server/config/passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, './server/views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'build')));
app.use(passport.initialize());

app.use('/', routes);

// catch 404 and forward to error handler
app.use(
    function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(
        function (err, req, res, next) {
            res.status(err.status || 500);
            res.render(
                'error', {
                    message : err.message,
                    error   : err
                });
        });
}

// production error handler
// no stacktraces leaked to user
app.use(
    function (err, req, res, next) {
        res.status(err.status || 500);
        res.render(
            'error', {
                message : err.message,
                error   : {}
            });
    });


module.exports = app;
