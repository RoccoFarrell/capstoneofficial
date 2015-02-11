var Patient = require('../models/patient');

exports.postPatients = function(req, res) {
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
};

exports.getPatients = function(req,res){
	Patient.find(function(err,patients){
		if(err) return res.send(err);

		res.json(patients);
	});
};

exports.deletePatients = function(req,res){
	Patient.remove({}, function(err, patients){
		if(err) return res.send(err);

		res.json({message: 'Successfully cleared all patients'});
	});
};