angular.module('patientService', [])

.factory('patientFactory', function($http) {

	// create the object
	var patientFac = {};

	// a function to get all the stuff
	patientFac.all = function() {
		return $http.get('/api/patients');
	}

	//create a new patient
	patientFac.create = function(patientData){
		console.log("patientData: " + patientData);
		return $http.post('/api/patients', patientData)
	};

	patientFac.get = function(id){
		return $http.get('/api/patients/' + id);
	};

	patientFac.deletePatient = function(id){
		return $http.delete('/api/patients/' + id);
	};

	return patientFac;

});