angular.module('homeCtrl', ['tagsService', 'patientService', 'googlechart'])

.controller('homeController', function(patientFactory, tagsFactory, $routeParams, $scope){
  var vm = this;

  patientFactory.all()
  .success(function(data){
    vm.patients = data;
  });

  vm.deletePatient = function(patient) {
    console.log(patient._id);
    patientFactory.deletePatient(patient._id)
    .success(function(){
      console.log("Deleted Patient!");
    });

    patientFactory.all()
    .success(function(data){
      vm.patients = data;
    });
  }

  vm.editPatient = function() {
    console.log("Edit here.");
  }

    vm.alertPatient = function() {
    console.log("Alert here.");
  }
  
});