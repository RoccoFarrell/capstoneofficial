var User = require('../../../app/models/user');

exports.postUsers = function(req, res){

		var user = new User();

		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;

		user.save(function(err) {
			if(err) {
				if(err.code == 11000)
					return res.json({ success: false, message: 'A user with that username already exists. '});
				else
					return res.send(err);
			}

			res.json({ message: 'New user created!' });
		});
	};

exports.getUsers = function(req, res){
	
		User.find(function(err, users){
			if(err) res.send(err);

			res.json(users);
			});
	};
