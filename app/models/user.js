// grab the packages that we need for the user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// user schema
var UserSchema = new Schema({
	name: String,
	username: { type: String, required: true, index: { unique: true }},
	//password: { type: String, required: true, select: false }
	password: { type: String, required: true}
});

// hash the password before the user is saved
UserSchema.pre('save', function(next) {
	var user = this;
	
	// hash the password only if the password has been changed or user is new
	if (!user.isModified('password')) return next();

	// generate the hash
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err) return next(err);

		// change the password to the hashed version
		user.password = hash;
		next();
	});
});

// method to compare a given password with the database hash
UserSchema.methods.verifyPassword = function(password, callback) {
	//var user = this;
	//user.password = 'passport';

	console.log('in verify password');
	console.log('password: ' + password);
	console.log('this.password: ' + this.password);
	console.log('this.username: ' + this.username);
	//console.log('user.password: ' + user.password);

	//return bcrpyt.compareSync(password, user.password);

	bcrypt.compare(password, this.password, function(err, isMatch){
		if(err) { console.log('err in bcrypt'); return callback(err); }
		callback(null, isMatch);
	});
	
};

// return the model
module.exports = mongoose.model('User', UserSchema);
