angular.module('tagsService', [])

.factory('tagsFactory', function($http) {

	// create the object
	var myFactory = {};

	// a function to get all the stuff
	myFactory.all = function(){
		return $http.get('/api/tags');
	};

	//create new user
	myFactory.create = function(tagData){
		console.log("tagData: " + tagData);
		return $http.post('/api/tags', tagData);
	};

	return myFactory;

});
