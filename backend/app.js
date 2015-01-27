// Standard-Module von Express
var express = require('express');
var path = require('path');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var busboy = require('connect-busboy');

var mongo = require('mongoskin'); // Datenbank-Middleware (schlanker als Mongoose-Zugriffe)
var db = mongo.db("mongodb://localhost:27017/personalChef", {native_parser:true});   // Verbindung mit der Datenbank

var tools = require('./javascript/tools'); // JS Funktionen für Berechnung der Rezept-Bewertungen

var app = express();
app.set('env', 'development'); // Setzen des App-Environments auf Development für detaillierte Stacktraces bei Fehlern


app.set('views', path.join(__dirname, 'views')); // Verknüpfung mit View Ordner
app.set('view engine', 'ejs'); // Setzen der View Engine auf EJS


app.use(busboy()); // busboy für Datei-Uploads
app.use(morgan('dev')); // morgan für Zugriffs-Logs


app.use(bodyParser.json()); // bodyParser zum Parsen von Requests
app.use(bodyParser.urlencoded({ extended: false }));


app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin", "*"); // erlauben von CORS
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); // erlauben von CORS
    res.header("Access-Control-Allow-Methods", "GET, POST"); // erlauben von bestimmten METHODEN
    req.db = db; // DB an Request übergeben
    next(); // Weiterleitung an den zuständigen Router
});


require('./routes/routes.js')(app); // Laden der allgemeinen Router-Datei, Übergabe von app und passport für Authentifizierung


// Fehlerbehandlung
// 404 abfangen und an Fehlerbehandlung übergeben
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// Development mit Stacktraces
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            status: err.status
        });
    });
};
// Production ohne Stacktraces
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        status: err.status
    });
});



// Skripte für Serverstart
console.log(Date().toString() + ": Server successfully started");

tools.updateStartScreen(db);


// Skripte, die regelmäßig ausgeführt werden sollen
var rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 1;

schedule.scheduleJob(rule, function(){
    tools.updateStartScreen(db);
});

module.exports = app;