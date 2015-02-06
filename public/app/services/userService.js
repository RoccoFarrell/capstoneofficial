angular.module('userService', [])

.factory('userFactory', function($http) {

	// create the object
	var localUserFactory = {};

	// a function to get all the stuff
	localUserFactory.all = function(){
		return $http.get('/api/users');
	};

	//create new user
	localUserFactory.create = function(userData){
		console.log("userData: " + userData);
		return $http.post('/api/users', userData);
	};

	return localUserFactory;

});
