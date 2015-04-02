angular.module('SPCtrl', ['tagsService', 'patientService', 'googlechart'])

.controller('SPController', function(patientFactory, tagsFactory, $routeParams, $scope){
  var vm = this;

  vm.message = 'sp';

  patientFactory.get($routeParams.patient_id)
  .success(function(data){
    vm.patient = data;

    console.log(vm.patient);

    
    computeData();
  });

  vm.weekTrend = function() {
    console.log("Input: " + vm.weekTrendRoom);
    var endDate = new Date();
    var second = 1000;
    var minute = 60 * second;
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;
    var startDateDay = new Date(endDate - week);
    console.log(vm.patient.patientName);
    tagsFactory.timeRange(startDateDay, endDate, vm.patient.patientName)
    .success(function(data){
      console.log("factory data: " + data);

      vm.weekTrendData = data;
      var i=0;
      var dayCounter=0;
      var count=0;
      vm.weekTrendRoomData = {};

      var currentDate;
      date = new Date(vm.weekTrendData[i].tagScanDate);
      currentDate = date;
      console.log(currentDate.getDate());

      //console.log(currentDate);
      //console.log(currentDate.getDate);

      for(i=0; i < vm.weekTrendData.length; i++)
      {
        var tempDate;
        date = new Date(vm.weekTrendData[i].tagScanDate);
        tempDate = date;

        if (tempDate.getDate() == currentDate.getDate())
        {
          if(vm.weekTrendData[i].tagID == vm.weekTrendRoom)
          {
            count++;
            vm.weekTrendRoomData[dayCounter] = count;
          }
        }
        else {
          currentDate = tempDate;
          count = 1;
          dayCounter++;
        }
      }

      console.log(vm.weekTrendRoomData);

      var chart_barTrend_data = [];

      for(i=0; i < 7; i++){
        console.log(vm.weekTrendRoomData[i]);
        chart_barTrend_data.push({
          c: [{v: (i+1)}, {v: vm.weekTrendRoomData[i]}]
        });
      }

      console.log(chart_barTrend_data);

      var chart_barTrend_week = {};

      chart_barTrend_week.type = "Bar";
      chart_barTrend_week.cssStyle = "height:250px; width:325px; padding: 10px; vertical-align: middle; display: table-cell;";
      chart_barTrend_week.data = { "cols": [
          {id: "roomID", label: "Day", type: "string"},
          {id: "tagCounts", label: "Reads", type: "number"}
          ], "rows": chart_barTrend_data
        };

      chart_barTrend_week.options = {
        chart: {
          title: vm.weekTrendRoom + ' Trend Over One Week',
          subtitle: 'Last 7 Days',
        },
        legend: { position: "none" }
      };

      chart_barTrend_week.formatters = {};
      $scope.chart_barTrend_week = chart_barTrend_week;

    }); 
  }

  vm.monthTrend = function() {
    console.log("Input: " + vm.monthTrendRoom);
    var endDate = new Date();
    var second = 1000;
    var minute = 60 * second;
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;
    var month = day * 30;
    var startDateDay = new Date(endDate - month);
    console.log(vm.patient.patientName);
    tagsFactory.timeRange(startDateDay, endDate, vm.patient.patientName)
    .success(function(data){
      console.log("factory data: " + data);

      vm.monthTrendData = data;
      var i=0;
      var dayCounter=0;
      var count=0;
      vm.monthTrendRoomData = {};

      var currentDate;
      date = new Date(vm.monthTrendData[i].tagScanDate);
      currentDate = date;
      console.log(currentDate.getDate());

      //console.log(currentDate);
      //console.log(currentDate.getDate);

      for(i=0; i < vm.monthTrendData.length; i++)
      {
        var tempDate;
        date = new Date(vm.monthTrendData[i].tagScanDate);
        tempDate = date;

        if (tempDate.getDate() == currentDate.getDate())
        {
          if(vm.monthTrendData[i].tagID == vm.monthTrendRoom)
          {
            count++;
            vm.monthTrendRoomData[dayCounter] = count;
          }
        }
        else {
          currentDate = tempDate;
          count = 1;
          dayCounter++;
        }
      }

      console.log(vm.monthTrendRoomData);

      var chart_barTrend_data_month = [];

      for(i=0; i < 30; i++){
        console.log(vm.monthTrendRoomData[i]);
        chart_barTrend_data_month.push({
          c: [{v: (i+1)}, {v: vm.monthTrendRoomData[i]}]
        });
      }

      console.log(chart_barTrend_data_month);

      var chart_barTrend_month = {};

      chart_barTrend_month.type = "Bar";
      chart_barTrend_month.cssStyle = "height:250px; width:325px; padding: 10px; vertical-align: middle; display: table-cell;";
      chart_barTrend_month.data = { "cols": [
          {id: "roomID", label: "Day", type: "string"},
          {id: "tagCounts", label: "Reads", type: "number"}
          ], "rows": chart_barTrend_data_month
        };

      chart_barTrend_month.options = {
        chart: {
          title: vm.weekTrendRoom + ' Trend Over One Month',
          subtitle: 'Last month',
        },
        legend: { position: "none" }
      };

      chart_barTrend_month.formatters = {};
      $scope.chart_barTrend_month = chart_barTrend_month;

    }); 
  }

  function computeData(){

    var chartSelect = 0;
    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.

    //--------------------------------------
    //Getting the data needed to draw graphs
    //--------------------------------------

    var endDate = new Date();

    /*
    endDate.setHours(0);
    endDate.setMinutes(0);
    endDate.setSeconds(0);
    endDate.setMilliseconds(0);
    */

    var second = 1000;
    var minute = 60 * second;
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;

    var startDateDay = new Date(endDate - day);
    var startDateWeek = new Date(endDate - week);
    var startDateMonth = new Date(endDate - week*4);

    console.log("end date: " + endDate);
    console.log("start date: " + startDateDay);
    //console.log("patient: " + vm.patient.patientName);

    tagsFactory.timeRange(startDateDay, endDate, vm.patient.patientName)
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

      console.log(vm.counts_bar_oneDay);

      chartSelect = 1;

      var sortable = [];
      for (var key in vm.counts_bar_oneDay)
      sortable.push([key, vm.counts_bar_oneDay[key]]);
      sortable.sort(function(a, b) {return b[1] - a[1]});

      console.log(sortable);

      var chart_barCounts_data = [];

      for(i=0; i < sortable.length; i++){
        chart_barCounts_data.push({
          c: [{v: sortable[i][0]}, {v: sortable[i][1]}]
        });
      }

      /*
      for (var key in vm.counts_bar_oneDay){
        chart_barCounts_data.push({
          c: [{v: key}, {v: vm.counts_bar_oneDay[key]}]
        });
      }
      */
      console.log(chart_barCounts_data); 

      var chart_barCounts_day = {};

      chart_barCounts_day.type = "Bar";
      chart_barCounts_day.cssStyle = "height:250px; width:325px; padding: 10px; vertical-align: middle; display: table-cell;";
      chart_barCounts_day.data = { "cols": [
          {id: "roomID", label: "Room", type: "string"},
          {id: "tagCounts", label: "Reads", type: "number"}
          ], "rows": chart_barCounts_data
        };

      chart_barCounts_day.options = {
        chart: {
          title:'Tag Scan Frequency',
          subtitle: 'Last 24 Hours',
        },
        legend: { position: "none" }
      };

      chart_barCounts_day.formatters = {};
      $scope.chart_barCounts_day = chart_barCounts_day;

    });

    tagsFactory.timeRange(startDateWeek, endDate, vm.patient.patientName)
    .success(function(data){
      //console.log("factory data: " + data);
      //console.log("call success");

      vm.tagDataWeek = data;

      vm.counts_bar_oneWeek = {};

      for(i=0; i< vm.tagDataWeek.length; i++){
    
          tagIDlocal = vm.tagDataWeek[i].tagID;

          if(tagIDlocal != "Hallway-001"){
            typeof(vm.counts_bar_oneWeek[tagIDlocal]) == "undefined" ? vm.counts_bar_oneWeek[tagIDlocal] = 1 :
            vm.counts_bar_oneWeek[tagIDlocal] += 1;
            date = new Date(vm.tagDataWeek[i].tagScanDate);
            vm.tagDataWeek[i].tagScanDateString = date.toString();
          }
          //console.log("id: " + vm.tags[i].tagID);
      }

      //console.log(vm.counts_bar_oneWeek);

      //chartSelect = 0;
      

      var sortable = [];
      for (var key in vm.counts_bar_oneWeek)
      sortable.push([key, vm.counts_bar_oneWeek[key]]);
      sortable.sort(function(a, b) {return b[1] - a[1]});

     // console.log(sortable);

      var chart_barCounts_data = [];

      for(i=0; i < sortable.length; i++){
        chart_barCounts_data.push({
          c: [{v: sortable[i][0]}, {v: sortable[i][1]}]
        });
      }

      /*
      for (var key in vm.counts_bar_oneWeek){
        chart_barCounts_data.push({
          c: [{v: key}, {v: vm.counts_bar_oneWeek[key]}]
        });
      }
      */
      console.log(chart_barCounts_data); 


      var chart_barCounts_week = {};

      chart_barCounts_week.type = "Bar";
      chart_barCounts_week.cssStyle = "height:250px; width:325px; padding: 10px; vertical-align: middle; display: table-cell;";
      chart_barCounts_week.data = { "cols": [
          {id: "roomID", label: "Room", type: "string"},
          {id: "tagCounts", label: "Reads", type: "number"}
          ], "rows": chart_barCounts_data
        };

      chart_barCounts_week.options = {
        chart: {
          title:'Tag Scan Frequency',
          subtitle: 'Last Week',
        },
        legend: { position: "none" }
      };

      chart_barCounts_week.formatters = {};
      $scope.chart_barCounts_week = chart_barCounts_week;
    
    });

    tagsFactory.timeRange(startDateMonth, endDate, vm.patient.patientName)
    .success(function(data){
      //console.log("factory data: " + data);
      //console.log("call success");

      vm.tagDataMonth = data;

      vm.counts_bar_oneMonth = {};

      for(i=0; i< vm.tagDataMonth.length; i++){
    
          tagIDlocal = vm.tagDataMonth[i].tagID;

          if(tagIDlocal != "Hallway-001"){
            typeof(vm.counts_bar_oneMonth[tagIDlocal]) == "undefined" ? vm.counts_bar_oneMonth[tagIDlocal] = 1 :
            vm.counts_bar_oneMonth[tagIDlocal] += 1;
            date = new Date(vm.tagDataMonth[i].tagScanDate);
            vm.tagDataMonth[i].tagScanDateString = date.toString();
          }
          //console.log("id: " + vm.tags[i].tagID);
      }

      //console.log(vm.counts_bar_oneMonth);

      //chartSelect = 0;

      vm.monthSum = 0;

      var sortable = [];
      for (var key in vm.counts_bar_oneMonth){
        sortable.push([key, vm.counts_bar_oneMonth[key]]);
        vm.monthSum += vm.counts_bar_oneMonth[key];
      }
      sortable.sort(function(a, b) {return b[1] - a[1]});

     // console.log(sortable);

      var chart_barCounts_data = [];


      for(i=0; i < sortable.length; i++){
        chart_barCounts_data.push({
          c: [{v: sortable[i][0]}, {v: sortable[i][1]}]
        });
      }

      /*
      for (var key in vm.counts_bar_oneMonth){
        chart_barCounts_data.push({
          c: [{v: key}, {v: vm.counts_bar_oneMonth[key]}]
        });
      }
      */
      console.log(chart_barCounts_data); 


      var chart_barCounts_month = {};

      chart_barCounts_month.type = "Bar";
      chart_barCounts_month.cssStyle = "height:250px; width:325px; padding: 10px; vertical-align: middle; display: table-cell;";
      chart_barCounts_month.data = { "cols": [
          {id: "roomID", label: "Room", type: "string"},
          {id: "tagCounts", label: "Reads", type: "number"}
          ], "rows": chart_barCounts_data
        };

      chart_barCounts_month.options = {
        chart: {
          title:'Tag Scan Frequency',
          subtitle: 'Last Month',
        },
        legend: { position: "none" }
      };

      chart_barCounts_month.formatters = {};
      $scope.chart_barCounts_month = chart_barCounts_month;
    
    });
  }
  
});