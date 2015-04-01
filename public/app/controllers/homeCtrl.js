angular.module('homeCtrl', ['tagsService', 'patientService', 'googlechart'])

.controller('homeController', function(patientFactory, tagsFactory, $routeParams, $scope){
  var vm = this;

  patientFactory.all()
  .success(function(data){
    vm.patients = data;

    for (i=0; i<vm.patients.length; i++ )
      {

        vm.patients[i].last10 = [];

        var endTime = new Date();
        var second = 1000;
        var minute = 60 * second;
        var hour = minute * 60;
        var day = hour * 24;
        var week = day * 7;
        var startTime = new Date(endTime - day);
        console.log("before call: " + vm.patients[i]);

        tagsFactory.timeRange(startTime, endTime, vm.patients[i].patientName)
        .success(function(data){
          //console.log(data);
          vm.last10tags = [];
          vm.tempdata = data;
          console.log("realfirst: " + vm.patients[i]);

          for (k=(vm.tempdata.length-10); k<vm.tempdata.length; k++ )
          {
            vm.last10tags.push(vm.tempdata[k]);
          }
          console.log("last10tags: " + vm.last10tags);
          console.log("first: " + vm.patients[i]);
          console.log("vm.last10tags: " + vm.last10tags);
          //vm.patients[i].last10 = vm.last10tags;
          console.log("second: " + vm.patients[i]);
        });
        //console.log(vm.last10tagsarray);
        //vm.patients[i].last10 = vm.last10tags;
        //console.log("outside api call: " + vm.patients[i].last10);

      }

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