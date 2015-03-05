angular.module('homeCtrl', ['tagsService', 'patientService', 'googlechart'])

.controller('homeController', function(patientFactory, tagsFactory, $routeParams, $scope){
  var vm = this;

  vm.last10tags = [];

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

  vm.getlast10tags = function(name) {
    console.log("get last");

    var endTime = new Date();

    var second = 1000;
    var minute = 60 * second;
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;

    endTime = endTime - 2*day;
    endTime = new Date(endTime);
    var startTime = new Date(endTime - day);

    tagsFactory.timeRange(startTime, endTime, name)
    .success(function(data){
      vm.last10data = data;

      for (i=(vm.last10data.length-10); i<vm.last10data.length; i++ )
      {
        vm.last10tags.push(vm.last10data[i]);
      }
      console.log(vm.last10tags);
      vm.last10tags = [];

    });

  }
  
});