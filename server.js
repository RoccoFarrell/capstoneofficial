// BASE SETUP
// ======================================

// CALL THE PACKAGES --------path------------
var express = require('express'); // call express
var app = express(); // define our app using express

var bodyParser = require('body-parser'); // get body-parser
var morgan = require('morgan'); // used to see requests
var mongoose = require('mongoose'); // for working w/ our database

var path = require("path");
var passport = require("passport")
var authController = require('./public/app/controllers/auth')

var port = process.env.PORT || 3000; // set the port for our app
var Patient = require('./app/models/patient');

var tagsController = require('./public/app/controllers/tagsController');
var userController = require('./public/app/controllers/userController');

//Connect to database
mongoose.connect('mongodb://localhost:27017/tagData');

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

//initialize passport
app.use(passport.initialize());


// ROUTES FOR OUR API
// =============================
// get an instance of the express router
var apiRouter = express.Router();

//middleware to use for all requests
apiRouter.use(function(req, res, next){
	//do logging
	console.log('Somebody just came in our app!');

	//more middle ware
	next();
	});

// test route to make sure everything is working
/* apiRouter.get('/', function(req, res) {
	res.json({ message: 'API' });
	}); */

// more routes for our API will happen here

apiRouter.route('/tags')
	.post(authController.isAuthenticated, tagsController.postTags)
	.get(authController.isAuthenticated, tagsController.getTags)
	.delete(authController.isAuthenticated, tagsController.deleteTags);

apiRouter.route('/users')
	.post(userController.postUsers)
	.get(authController.isAuthenticated, userController.getUsers);

apiRouter.route('/patients')

	.post(function(req, res) {
		var patient = new Patient();

		patient.patientName = req.body.patientName;
		patient.patientAge = req.body.patientAge;
		patient.patientAddress = req.body.patientAddress;
		patient.patientCaretaker = req.body.patientCaretaker;

		patient.save(function(err)
		{
			if(err){
				if(err.code == 11000)
					return res.json({ success: false, message: 'duplicate entry'});
				else
					return res.json({ success: false, message: 'err' + err.code});
			}

			res.json({ message: 'Patient entry created!'});
		});
	})

	.get(function(req,res){
		Patient.find(function(err,patients){
			if(err) return res.send(err);

			res.json(patients);
		});
	})

	.delete(function(req,res){
		Patient.remove({}, function(err, patients){
			if(err) return res.send(err);

			res.json({message: 'Successfully cleared all patients'});
		});
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

var mainRouter = express.Router();

mainRouter.route('/login')

	.post(authController.initialLogin, function(req, res){
		console.log('using mainRouter');
		res.redirect('/users/' + req.user.username);
	});


app.use('/', mainRouter);

// basic route for the home page
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/views/index.html'));
	});

// START THE SERVER
// ===============================
app.listen(port);
console.log('Magic happens on port ' + port);
