// inject ngRoute for all our routing needs
angular.module('app.routes', ['ngRoute'])

// configure our routes
.config(function($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true);
    
    $routeProvider

        // route for the home page
        .when('/home', {
            templateUrl: '../views/home.html',
            controller: 'homeController',
            controllerAs: 'home'
        })

        //route for get tags
        .when('/getTags', {
            templateUrl: '../views/getTags.html',
            controller  : 'getTagsController',
            controllerAs: 'getTags'
        })

        //route for post tags
        .when('/postTags', {
            templateUrl: '../views/postTags.html',
            controller  : 'postTagsController',
            controllerAs: 'postTags'
        })

        .when('/login', {
            templateUrl: '../views/login.html',
            controller : 'mainController',
            controllerAs : 'login'
        })

        .otherwise({
            redirectTo: "/"
        });


    
});