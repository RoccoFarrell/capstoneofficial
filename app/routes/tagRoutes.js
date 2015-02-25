var Tag = require('../models/tag');
var url = require('url');

exports.postTags = function(req, res){

	var tag = new Tag();

	tag.tagID = req.body.tagID;
	tag.tagScanDate = req.body.tagScanDate;
	tag.tagPatient = req.body.tagPatient;

	console.log('tag data getting transmitted to API: ' + req.body.tagID);

	tag.save(function(err)
	{
		if(err){
			if(err.code == 11000)
				return res.json({ success: false, message: 'duplicate entry'});
			else
			{
				errCode = err.code;
				return res.json({ success: false, message: 'err: ' + errCode});
			}
		}
			res.json({ message: 'Tag entry created!'})
	});
};


exports.getTimeRangeTags = function(req, res){

	var URL_parts = url.parse(req.url, true);
	var query = URL_parts.query;

	//console.log(query.patientName);

	Tag.find({ $and: [{ tagScanDate: { $gte: query.startDate }}, 
		{ tagScanDate: { $lte: query.endDate }},
		{ tagPatient: query.patientName } 

		]},
	 function(err, tags){
		if(err) res.send(err);
	
		res.json(tags);
	});
};

exports.getAllTags = function(req, res){

	Tag.find(function(err, tags) {
		if (err) res.send(err);
			res.json(tags);
			
	});
};

exports.deleteTags = function(req, res){

	Tag.remove({}, function(err, tags){
		if(err) return res.send(err);

		res.json({ message: 'Successfully cleared all tags'});
	});
};