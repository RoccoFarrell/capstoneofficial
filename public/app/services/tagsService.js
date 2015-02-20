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

	localTagsFactory.timeRange = function(sDate, eDate){

		//console.log("factory: startdate: " + startDate + " end date: " + endDate);

		return $http.get('/api/tags/timeRange', {params: {startDate: sDate, endDate: eDate}});

	}

	return localTagsFactory;

});
