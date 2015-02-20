// name our angular app
angular.module('mainApp', [
  'ngResource',
  'app.routes',
  'authService',
  'mainCtrl',
  'homeCtrl',
  'tagsService',
  'patientService',
  'userService'
  ])

.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptor');
})

.config(['$resourceProvider', function($resourceProvider){
  $resourceProvider.defaults.stripTrailingSlashes = false;
}])

//new user controller
.controller('newUserController', function(userFactory){
  var vm = this;

  vm.saveUser = function(){
    vm.processing = true;
    vm.message = ' ';

    userFactory.create(vm.userData)

    .success(function(data){

      vm.processing = false;

      vm.userData = {};
      vm.message = data.message;
      console.log('post user worked');
    });

  }
})

//new user controller
.controller('newPatientController', function(patientFactory){
  var vm = this;

  vm.savePatient = function(){
    vm.processing = true;
    vm.message = ' ';

    patientFactory.create(vm.userData)

    .success(function(data){

      vm.processing = false;

      vm.userData = {};
      vm.message = data.message;
      console.log('Created new patient!');
    });

  }
})

//getTags controller
.controller('getTagsController', function(tagsFactory){

  var vm = this;
  var date;

  //vm.message = 'get tags yeah';

  tagsFactory.all()

    .success(function(data){

      vm.tags = data;
      //console.log('get tags worked');
      //console.log('length: ' + vm.tags.length)

      vm.counts = {};

      for(i=0; i< vm.tags.length; i++){
    
        tagIDlocal = vm.tags[i].tagID;

        typeof(vm.counts[tagIDlocal]) == "undefined" ? vm.counts[tagIDlocal] = 1 :
        vm.counts[tagIDlocal] += 1;

        //console.log("tagScanDate to string: " + vm.tags[i].tagScanDate);
        //console.log("test if JSON date: ");
        //console.log(vm.tags[i].tagScanDate instanceof Date);
        //console.log("test if JSON object: ");
        //console.log(vm.tags[i] instanceof Object);
        //console.log("test if conversion is JSON Date: ");
        date = new Date(vm.tags[i].tagScanDate);
        //console.log(date instanceof Date)
        //console.log(date);
        vm.tags[i].tagScanDateString = date.toString();
        //console.log(vm.tags[i].tagScanDateString);

        console.log("id: " + vm.tags[i].tagID);
 
      }

      console.log(vm.counts);
    });
})

//postTags controller
.controller('postTagsController', function(tagsFactory){
  var vm = this;

  vm.saveTag = function(){
    vm.processing = true;
    vm.message = ' ';

    tagsFactory.create(vm.tagData)

    .success(function(data){

      vm.processing = false;

      vm.tagData = {};
      vm.message = data.message;
      console.log('post tags worked');
    });
  }
});
  