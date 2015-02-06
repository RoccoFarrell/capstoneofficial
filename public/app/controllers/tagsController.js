var Tag = require('../../../app/models/tag');

exports.postTags = function(req, res){

		var tag = new Tag();

		tag.tagID = req.body.tagID;
		tag.tagScanDate = req.body.tagScanDate;

		console.log('tag data getting transmitted to API: ' + req.body.tagID);

		tag.save(function(err)
		{
			if(err){
				if(err.code == 11000)
					return res.json({ success: false, message: 'duplicate entry'});
				else
					return res.json({ success: false, message: 'err' + err.code});

			}
				res.json({ message: 'Tag entry created!'});
		});
};

exports.getTags = function(req, res){

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