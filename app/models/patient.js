var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var patientSchema = new Schema({
	patientName: {type: String, required: true},
	patientAge: {type: Number, required: true},
	patientAddress: {
		street: {type: String, required: true},
		city: {type: String, required: true},
		state: {type: String, required: true},
		zipcode: {type: Number, required: true}
	},
	patientCaretaker: {type: String, required: true}
	//Add room count object
});

module.exports = mongoose.model('Patient', patientSchema);

/* For inserting manually into MongoDB shell
({
	patientName: "Josh Sukzacodin",
	patientAge: 69,
	patientAddress: [{
		street: "1 Beatsauce Lane",
		city: "Jackmehoff",
		state: "NJ",
		zipcode: 07750
	}],
	patientCaretaker: "capstone"
})
*/