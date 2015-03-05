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

  vm.getlast10min = function(name) {
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

    console.log(endTime);
    console.log(startTime);
    console.log(name);

    tagsFactory.timeRange(startTime, endTime, name)
    .success(function(data){
      console.log("factory data: " + data);
      vm.last10data = data;
    });

  }




  /*tagsFactory.timeRange(startTime, endTime, vm.patient.patientName)
    .success(function(data){
      console.log("factory data: " + data);
      //console.log("call success");

      vm.tagDataDay = data;
      vm.counts_bar_oneDay = {};

      for(i=0; i < vm.tagDataDay.length; i++)
      {

          tagIDlocal = vm.tagDataDay[i].tagID;

          if(tagIDlocal != "Hallway-001"){
            typeof(vm.counts_bar_oneDay[tagIDlocal]) == "undefined" ? vm.counts_bar_oneDay[tagIDlocal] = 1 :
            vm.counts_bar_oneDay[tagIDlocal] += 1;
            date = new Date(vm.tagDataDay[i].tagScanDate);
            vm.tagDataDay[i].tagScanDateString = date.toString();
          }
          //console.log("id: " + vm.tags[i].tagID);
      }

      //console.log(vm.counts_bar_oneDay);
*/

  
});