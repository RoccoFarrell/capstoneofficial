// grab the packages that we need for the user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// tag schema
var tagSchema = new Schema({
	tagID: { type: String, required: true},
	tagScanDate: {type: Date, required: true}
});

// return the model
module.exports = mongoose.model('Tag', tagSchema);
