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

        /*.when('/patients', {
            templateUrl: '../views/patients.html',
            controller: 'patientsController',
            controllerAs: 'patient'
        })*/

        .when('/home/:patient_id', {
            templateUrl: '../views/singlePatient.html',
            controller: 'SPController',
            controllerAs: 'singlePatient'
        })

        .when('/newUser', {
            templateUrl: '../views/newUser.html',
            controller: 'newUserController',
            controllerAs: 'newUser'
        })

        .when('/newPatient', {
            templateUrl: '../views/newPatient.html',
            controller: 'newPatientController',
            controllerAs: 'newPatient'
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

        .when('/', {
            templateUrl: '../views/cover.html',
            controller : 'mainController',
            controllerAs : 'cover'
        })

        .otherwise({
            redirectTo: '/404'
        });


    
});