var jwt = require('jsonwebtoken');
var config = require('../../config');

var superSecret = config.secret;

var User = require('../models/user');

var patientRoutes = require('./patientRoutes');
var tagRoutes = require('./tagRoutes');
var userRoutes = require('./userRoutes');

module.exports = function(app, express) {
	var apiRouter = express.Router();

	apiRouter.post('/users', userRoutes.postUsers);

	apiRouter.post('/authenticate', function(req, res){

	User.findOne({
		username: req.body.username
	}).select('name username password').exec(function(err, user){

		console.log("Authenticating: " + req.body.username);

		if(err) throw err;

		//no user with that username found
		if(!user) {
			console.log("Authentication of " + req.body.username + "failed: no user found");
			res.json({
				success: false,
				message: 'Authetication failed. User not found.'
			});
		} else if (user) {

			//check if password matches
			var validPassword = user.comparePassword(req.body.password);
			if(!validPassword) {
				console.log("Authentication of " + req.body.username + "failed: wrong password");
				res.json({
					success: false,
					message: 'Authentication failed. Wrong password.'
				});
			} else {

				//if user is found and password is right
				//create token
				var token = jwt.sign({
					name: user.name,
					username: user.username
				}, superSecret, {
					expiresInMinutes: 1440 //24 hours
				});

				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}
		}
	});
});


	//middleware to use for all requests
	apiRouter.use(function(req, res, next){
		//do logging
		console.log('API middleware');

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		// decode token
		if(token) {
			jwt.verify(token, superSecret, function(err, decoded){
				if(err) {
					return res.status(403).send({
						success: false,
						message: 'Failed to authenticate token.'
					});
				} else {
					//if everything is good, save to request for use in other routes
					req.decoded = decoded;

					next();
				}
			});
		} else {
			return res.status(403).send({
				success: false,
				message: 'No token provided.'
			});
		}

		//more middle ware
		//next();
	});

	// test route to make sure everything is working
	/* apiRouter.get('/', function(req, res) {
		res.json({ message: 'API' });
		}); */

	// more routes for our API will happen here

	apiRouter.route('/tags')
		.post(tagRoutes.postTags)
		.get(tagRoutes.getAllTags)
		.delete(tagRoutes.deleteTags);

	apiRouter.route('/tags/timeRange')
		.get(tagRoutes.getTimeRangeTags);

	apiRouter.route('/users')
		//.post(userRoutes.postUsers)
		.get(userRoutes.getUsers);

	apiRouter.route('/patients')
		.post(patientRoutes.postPatients)
		.get(patientRoutes.getPatients)
		.delete(patientRoutes.deletePatients);

	apiRouter.route('/me').get(function(req,res){
		res.send(req.decoded);
	});

	return apiRouter;
};