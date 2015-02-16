// name our angular app
angular.module('mainApp', [
  'app.routes',
  'authService',
  'mainCtrl',
  'tagsService',
  'patientService',
  'userService'  
  ])

.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptor');
})

//home controller
.controller('homeController', function(patientFactory){
  var vm = this;

  vm.message = 'home';

  patientFactory.all()
  .success(function(data){
    vm.patients = data;
    console.log('Get patients worked!');
  });
})

//login controller
.controller('newUserController', function(userFactory){
  var vm = this;
  //vm.message = 'logging in';

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

      for(i=0; i< vm.tags.length; i++){
    
        //console.log("tagScanDate to string: " + vm.tags[i].tagScanDate);
        //console.log("test if JSON date: ");
        //console.log(vm.tags[i].tagScanDate instanceof Date);
        //console.log("test if JSON object: ");
        //console.log(vm.tags[i] instanceof Object);
        //console.log("test if conversion is JSON Date: ");
        date = new Date(vm.tags[i].tagScanDate);
        //console.log(date instanceof Date)
        //console.log(date);
        vm.tags[i].tagScanDate = date.toString();
      }


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
  
/*.controller('getPatientsController', function(patientsFactory){
  var vm = this;

  patientsFactory.all()
    .success(function(data){
      vm.patients = data;
      console.log('Get patients worked!');
    });
});*/