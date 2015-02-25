angular.module('tagsService', [])

.factory('tagsFactory', function($http, $resource) {

	// create the object
	var localTagsFactory = {};

	// a function to get all the stuff
	localTagsFactory.all = function(){
		return $http.get('/api/tags');
	};

	//create new tag entry
	localTagsFactory.create = function(tagData){
		return $http.post('/api/tags', tagData);
	};

	localTagsFactory.timeRange = function(sDate, eDate, pName){

		//console.log("factory: startdate: " + sDate + " end date: " + eDate + " patientName: " + pName);

		return $http.get('/api/tags/timeRange', {params: {startDate: sDate, endDate: eDate, patientName: pName}});

	}

	return localTagsFactory;

});
