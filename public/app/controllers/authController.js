var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../../../app/models/user');

passport.use(new BasicStrategy(
	function(username, password, callback){
		User.findOne({ username: username}, function(err, user){

			if(err) { return callback(err); }


			//No user with that username
			if(!user){ return callback(null, false, { message: 'Incorrect username.' }); }
			
			console.log('user: ' + user);
			console.log('user.password: ' + user.password)

			user.verifyPassword(password, function(err, isMatch){
				if(err) {console.log(username + ' ' + password );
return callback(err); }

				//password didnt match
				if(!isMatch) {return callback(null, false, { message: 'Incorrect password.'}); }

				//success
				return callback(null, user);
			});
		});
	}
));

exports.isAuthenticated = passport.authenticate('basic', { session: false});
exports.initialLogin = passport.authenticate('basic', {
	successRedirect: '/',
	failureRedirect: 'login',
	failureFlash: true });
