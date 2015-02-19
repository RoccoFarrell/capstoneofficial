angular.module('tagsService', [])

.factory('tagsFactory', function($http) {

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

	return localTagsFactory;

});
