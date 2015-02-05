// name our angular app
angular.module('displayTags', ['routerRoutes', 'tagsService', 'patientService'])

.controller('mainController', function() {

	// bind this to vm (view-model)
  var vm = this;	

  // define variables and objects on this
  // this lets them be available to our views

	// define a basic variable
	vm.message = 'View your patients to the right';

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

//getTags controller
.controller('getTagsController', function(tagsFactory){

  var vm = this;

  vm.message = 'get tags yeah';

  tagsFactory.all()

    .success(function(data){

      vm.tags = data;
      console.log('it worked');
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
      console.log('post worked');
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