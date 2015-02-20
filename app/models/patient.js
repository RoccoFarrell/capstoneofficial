var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var patientSchema = new Schema({
	patientName: {type: String, required: true},
	patientAge: {type: Number, required: true},
	patientAddress: {
		street: {type: String, required: true},
		city: {type: String, required: true},
		state: {type: String, required: true},
		zipcode: {type: String, required: true}
	},
	patientCaretaker: {type: String, required: true}
	//Add room count object
});

module.exports = mongoose.model('Patient', patientSchema);