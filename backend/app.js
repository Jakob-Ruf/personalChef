var express = require('express');
var path = require('path');
var logger = require('morgan');
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var schedule = require('node-schedule');
var busboy = require('connect-busboy');

// database connection
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/personalChef", {native_parser:true});

// require the different routes
var routes = require('./routes/index');
var users = require('./routes/users');
var recipes = require('./routes/recipes');
var ingredients = require('./routes/ingredients');  

// javascript functions to be used inside this app
var tools = require('./javascript/tools');
var images = require('./javascript/images');


// uncomment this line to run the app in the background as a daemon
// only for productive purposes
 require('daemon')();

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(busboy());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
// Allow CORS
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    req.db = db;
    next();
});

// set up our routes
app.use('/', routes);
app.use('/users', users);
app.use('/recipes', recipes);
app.use('/ingredients', ingredients);

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


// scripts to execute once when starting the server
console.log(Date().toString() + ": Server successfully started");
images.imageManip();
tools.updateRatingsAndLikes(db);
tools.checkForDiscrepancies(db);
tools.updateStartScreen(db);



// scripts to execute multiple times

// execute every 1st minute of every hour
var rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 1;
schedule.scheduleJob(rule, function(){
    tools.updateStartScreen(db);
});

// setInterval(tools.updateRatingsAndLikes, 600000, db);
// setInterval(tools.updateStartScreen, 600000, db);
// setInterval(tools.checkForDiscrepancies, 600000, db);
// console.log(Date().toString() +": Daily jobs scheduled");



module.exports = app;
