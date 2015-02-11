// BASE SETUP
// ======================================

// CALL THE PACKAGES --------path------------
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser'); // get body-parser
var morgan = require('morgan'); // used to see requests
var mongoose = require('mongoose'); // for working w/ our database
var config = require('./config');

var path = require('path');
//var passport = require("passport");

//Connect to database
mongoose.connect(config.database);

// APP CONFIGURATION ---------------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

// log all requests to the consoleBuild a RESTful Node API 59
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));


// ROUTES FOR OUR API
// =============================
// get an instance of the express router
var apiRouter = require('./app/routes/api')(app, express);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

// basic route for the home page
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/views/index.html'));
	});

// START THE SERVER
// ===============================
app.listen(config.port);
console.log('Application running on ' + config.port);