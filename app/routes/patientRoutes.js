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

exports.getOnePatient = function(req,res){
	Patient.findById(req.params.patient_id, function(err, patient){
		if (err) return res.send(err);

		res.json(patient);
	});
};

exports.deleteOnePatient = function(req,res){
	Patient.remove({_id: req.params.patient_id}, function(err,patient){
		if (err) return res.send(err);

		res.json({message: "Successfully deleted that patient"});
	});
};

exports.editOnePatient = function(req,res){
	Patient.findById(req.params.patient_id, function(err,patient){
		if (err) return res.send(err);

		//Update info only if new
		if (req.body.patientName) patient.patientName = req.body.patientName;
		if (req.body.patientAge) patient.patientAge = req.body.patientAge;
		if (req.body.patientCaretaker) patient.patientCaretaker = req.body.patientCaretaker;
		//if (req.body.patientAddress.street) patient.patientAddress.street = req.body.patientAddress.street;
		//if (req.body.patientAddress.city) patient.patientAddress.city = req.body.patientAddress.city;
		//if (req.body.patientAddress.state) patient.patientAddress.state = req.body.patientAddress.state;
		//if (req.body.patientAddress.zipcode) patient.patientAddress.zipcode = req.body.patientAddress.zipcode;

		//save patient
		patient.save(function(err) {
			if (err) return res.send(err);

			res.json({message: "Patient updated!"});
		});
	});
};