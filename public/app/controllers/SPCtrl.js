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

  vm.weekTrend = function(room) {
    vm.weekTrendProcessing = true;
    console.log("Input: " + vm.weekTrendRoom);

    var endDate = new Date();
    var second = 1000;
    var minute = 60 * second;
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;
    var startDateDay = new Date(endDate - week);

    //console.log("room: " + room);

    //if(typeof(room != "undefined")) vm.weekTrendRoom = room;

    //console.log(vm.patient.patientName);
    tagsFactory.timeRange(startDateDay, endDate, vm.patient.patientName)
    .success(function(data){
      vm.weekTrendProcessing = false;

      vm.weekTrendData = data;
      var i=0;
      var dayCounter=0;
      var count=0;
      vm.weekTrendRoomData = {};

      var currentDate;
      date = new Date(vm.weekTrendData[i].tagScanDate);
      currentDate = date;
      //console.log(currentDate.getDate());

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

      //console.log(vm.weekTrendRoomData);

      var chart_barTrend_data = [];

      for(i=0; i < 7; i++){
        //console.log(vm.weekTrendRoomData[i]);
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
    vm.monthTrendProcessing = true;
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
      vm.monthTrendProcessing = false;

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
          title: vm.monthTrendRoom + ' Trend Over One Month',
          subtitle: 'Last month',
        },
        legend: { position: "none" }
      };

      chart_barTrend_month.formatters = {};
      $scope.chart_barTrend_month = chart_barTrend_month;

    }); 
  }

  vm.sixmonthTrend = function() {
    vm.sixmonthTrendProcessing = true;
    console.log("Input: " + vm.sixmonthTrendRoom);
    var endDate = new Date();
    var second = 1000;
    var minute = 60 * second;
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;
    var month = day * 30;
    var startDate6Month = new Date(endDate - week*26);
    console.log(vm.patient.patientName);
    tagsFactory.timeRange(startDate6Month, endDate, vm.patient.patientName)
    .success(function(data){

      vm.sixmonthTrendProcessing = false;

      vm.sixmonthTrendData = data;
      var weekCounter=0;
      var count=0;
      vm.sixmonthTrendRoomData = {};
      var newWeek0=0;
      var newWeek1=0;

      for(i=0; i < vm.sixmonthTrendData.length; i++)
      {
        var tempDate;
        date = new Date(vm.sixmonthTrendData[i].tagScanDate);
        tempDate = date;
        //console.log(tempDate.getDay());

        if (newWeek1==1 && newWeek0==1) {
          count = 1;
          weekCounter++;
          newWeek0=0;
          newWeek1=0;
        }

        if (tempDate.getDay() == 0)
        {
          newWeek0=1;
          if(vm.sixmonthTrendData[i].tagID == vm.sixmonthTrendRoom)
          {
            count++;
            vm.sixmonthTrendRoomData[weekCounter] = count;
          }
        }
        else
        {
          newWeek1 = 1;
          newWeek0 = 0;
          if(vm.sixmonthTrendData[i].tagID == vm.sixmonthTrendRoom)
          {
            count++;
            vm.sixmonthTrendRoomData[weekCounter] = count;
          }
        }
      }

      var chart_barTrend_data_sixmonth = [];

      for(i=0; i < 26; i++){
        console.log(vm.sixmonthTrendRoomData[i]);
        chart_barTrend_data_sixmonth.push({
          c: [{v: (i+1)}, {v: vm.sixmonthTrendRoomData[i]}]
        });
      }

      console.log(chart_barTrend_data_sixmonth);

      var chart_barTrend_sixmonth = {};

      chart_barTrend_sixmonth.type = "Bar";
      chart_barTrend_sixmonth.cssStyle = "height:250px; width:325px; padding: 10px; vertical-align: middle; display: table-cell;";
      chart_barTrend_sixmonth.data = { "cols": [
          {id: "roomID", label: "Week", type: "string"},
          {id: "tagCounts", label: "Reads", type: "number"}
          ], "rows": chart_barTrend_data_sixmonth
        };

      chart_barTrend_sixmonth.options = {
        chart: {
          title: vm.sixmonthTrendRoom + ' Trend Over Six Months',
          subtitle: 'Last 6 months',
        },
        legend: { position: "none" }
      };

      chart_barTrend_sixmonth.formatters = {};
      $scope.chart_barTrend_sixmonth = chart_barTrend_sixmonth;

    }); 
  }

  vm.yearTrend = function() {
    vm.yearTrendProcessing = true;
    console.log("Input: " + vm.yearTrendRoom);
    var endDate = new Date();
    var second = 1000;
    var minute = 60 * second;
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;
    var month = day * 30;
    var startDateDay = new Date(endDate - week*52);
    console.log(vm.patient.patientName);
    tagsFactory.timeRange(startDateDay, endDate, vm.patient.patientName)
    .success(function(data){

      vm.yearTrendProcessing = false;

      vm.yearTrendData = data;
      var weekCounter=0;
      var count=0;
      vm.yearTrendRoomData = {};
      var newWeek0=0;
      var newWeek1=0;

      for(i=0; i < vm.yearTrendData.length; i++)
      {
        var tempDate;
        date = new Date(vm.yearTrendData[i].tagScanDate);
        tempDate = date;
        //console.log(tempDate.getDay());

        if (newWeek1==1 && newWeek0==1) {
          count = 1;
          weekCounter++;
          newWeek0=0;
          newWeek1=0;
        }

        if (tempDate.getDay() == 0)
        {
          newWeek0=1;
          if(vm.yearTrendData[i].tagID == vm.yearTrendRoom)
          {
            count++;
            vm.yearTrendRoomData[weekCounter] = count;
          }
        }
        else
        {
          newWeek1 = 1;
          newWeek0 = 0;
          if(vm.yearTrendData[i].tagID == vm.yearTrendRoom)
          {
            count++;
            vm.yearTrendRoomData[weekCounter] = count;
          }
        }
      }

      var chart_barTrend_data_year = [];

      for(i=0; i < 52; i++){
        console.log(vm.yearTrendRoomData[i]);
        chart_barTrend_data_year.push({
          c: [{v: (i+1)}, {v: vm.yearTrendRoomData[i]}]
        });
      }

      console.log(chart_barTrend_data_year);

      var chart_barTrend_year = {};

      chart_barTrend_year.type = "Bar";
      chart_barTrend_year.cssStyle = "height:250px; width:325px; padding: 10px; vertical-align: middle; display: table-cell;";
      chart_barTrend_year.data = { "cols": [
          {id: "roomID", label: "Week", type: "string"},
          {id: "tagCounts", label: "Reads", type: "number"}
          ], "rows": chart_barTrend_data_year
        };

      chart_barTrend_year.options = {
        chart: {
          title: vm.yearTrendRoom + ' Trend Over One Year',
          subtitle: 'Last year',
        },
        legend: { position: "none" }
      };

      chart_barTrend_year.formatters = {};
      $scope.chart_barTrend_year = chart_barTrend_year;

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
    var startDate6Month = new Date(endDate - week*26);
    var startDateYear = new Date(endDate - week*52);

    console.log("end date: " + endDate);
    console.log("start date: " + startDateDay);
    //console.log("patient: " + vm.patient.patientName);

    tagsFactory.timeRange(startDateDay, endDate, vm.patient.patientName)
    .success(function(data){
      //console.log("factory data: " + data);
      //console.log("call success");

      vm.tagDataDay = data;
      vm.counts_bar_oneDay = {};
      vm.times_oneDay = {};

      for(i=0; i < vm.tagDataDay.length; i++){

          tagIDlocal = vm.tagDataDay[i].tagID;
          //console.log("tagIDlocal: " + tagIDlocal);

          if(tagIDlocal != "Hallway-001"){
            typeof(vm.counts_bar_oneDay[tagIDlocal]) == "undefined" ? vm.counts_bar_oneDay[tagIDlocal] = 1 :
            vm.counts_bar_oneDay[tagIDlocal] += 1;
          }

          date = new Date(vm.tagDataDay[i].tagScanDate);
          vm.tagDataDay[i].tagScanDateString = date.toString();

          //console.log("tagScanDate: " + vm.tagDataDay[i].tagScanDateString);

          if(i != vm.tagDataDay.length - 1){
            //console.log("in if");
            date = new Date(vm.tagDataDay[i].tagScanDate);
            datePlusOne = new Date(vm.tagDataDay[i+1].tagScanDate);
            //console.log("datePlusOne - date: " + (datePlusOne - date));
            //console.log("vm.times_oneDay[tagIDlocal]: " + vm.times_oneDay[tagIDlocal]);
            if(typeof(vm.times_oneDay[tagIDlocal]) == "undefined"){
              vm.times_oneDay[tagIDlocal] = 0;
            }
            else {
              vm.times_oneDay[tagIDlocal] += (datePlusOne - date);
            }
            //console.log("times length: " + vm.times_oneDay.length);
          }
          //console.log("id: " + vm.tags[i].tagID);
      }

      //display times
      //console.log("times length: " + vm.times_oneDay.length);
      vm.averages_oneDay = [];

      for(var key in vm.counts_bar_oneDay){
        //console.log("vm.times_oneDay[key]: " + vm.times_oneDay[key]);
        //console.log(key + ": " + vm.times_oneDay[key].toString());
        var temp = vm.times_oneDay[key] / 1000;
        //console.log(key + ": " + temp + " seconds");
        temp = temp / 60;
        //console.log(key + ": " + temp + " minutes");

        vm.averages_oneDay[key] = temp / vm.counts_bar_oneDay[key];
        //console.log(vm.averages_oneDay[key] + " minutes per visit to " + key);
 
        //vm.averages_oneDay[key] = temp / vm.counts_bar_oneDay[key];
        vm.averages_oneDay.push([key, vm.counts_bar_oneDay[key], temp / vm.counts_bar_oneDay[key]]);
        //console.log(vm.averages_oneDay[key] + " minutes per visit to " + key);
        vm.averages_oneDay[0][2].toFixed(2);
      }

      //console.log("here");
      //console.log(vm.averages_oneDay);

      //console.log(vm.times_oneDay);
      //console.log(vm.counts_bar_oneDay);

      chartSelect = 1;

      var sortable = [];
      for (var key in vm.counts_bar_oneDay)
      sortable.push([key, vm.counts_bar_oneDay[key]]);
      sortable.sort(function(a, b) {return b[1] - a[1]});

      //console.log(sortable);

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
      //console.log(chart_barCounts_data); 

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
      vm.times_oneWeek = {};

      for(i=0; i< vm.tagDataWeek.length; i++){
    
          tagIDlocal = vm.tagDataWeek[i].tagID;

          if(tagIDlocal != "Hallway-001"){
            typeof(vm.counts_bar_oneWeek[tagIDlocal]) == "undefined" ? vm.counts_bar_oneWeek[tagIDlocal] = 1 :
            vm.counts_bar_oneWeek[tagIDlocal] += 1;
          }

          date = new Date(vm.tagDataWeek[i].tagScanDate);
          vm.tagDataWeek[i].tagScanDateString = date.toString();

          //console.log("tagScanDate: " + vm.tagDataDay[i].tagScanDateString);

          if(i != vm.tagDataWeek.length - 1){
            //console.log("in if");
            date = new Date(vm.tagDataWeek[i].tagScanDate);
            datePlusOne = new Date(vm.tagDataWeek[i+1].tagScanDate);
            //console.log("datePlusOne - date: " + (datePlusOne - date));
            //console.log("vm.times_oneDay[tagIDlocal]: " + vm.times_oneDay[tagIDlocal]);
            if(typeof(vm.times_oneWeek[tagIDlocal]) == "undefined"){
              vm.times_oneWeek[tagIDlocal] = 0;
            }
            else {
              vm.times_oneWeek[tagIDlocal] += (datePlusOne - date);
            }
            //console.log("times length: " + vm.times_oneDay.length);
          }
          //console.log("id: " + vm.tags[i].tagID);
      }

      //display times
      //console.log("times length: " + vm.times_oneDay.length);
      vm.averages_oneWeek = [];

      for(var key in vm.counts_bar_oneWeek){
        //console.log("vm.times_oneDay[key]: " + vm.times_oneDay[key]);
        //console.log(key + ": " + vm.times_oneDay[key].toString());
        var temp = vm.times_oneWeek[key] / 1000;
        //console.log(key + ": " + temp + " seconds");
        temp = temp / 60;
        //console.log(key + ": " + temp + " minutes");

        //vm.averages_oneWeek[key] = temp / vm.counts_bar_oneWeek[key];

        vm.averages_oneWeek.push([key, vm.counts_bar_oneWeek[key], temp / vm.counts_bar_oneWeek[key]]);
        //console.log(vm.averages_oneWeek[key] + " minutes per visit to " + key);
        vm.averages_oneWeek[0][2].toFixed(2);

      }

      //console.log(vm.averages_oneWeek);
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
      //console.log(chart_barCounts_data); 


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
      vm.times_oneMonth = {};

      for(i=0; i< vm.tagDataMonth.length; i++){
    
          tagIDlocal = vm.tagDataMonth[i].tagID;

          if(tagIDlocal != "Hallway-001"){
            typeof(vm.counts_bar_oneMonth[tagIDlocal]) == "undefined" ? vm.counts_bar_oneMonth[tagIDlocal] = 1 :
            vm.counts_bar_oneMonth[tagIDlocal] += 1;
          }

          date = new Date(vm.tagDataMonth[i].tagScanDate);
          vm.tagDataMonth[i].tagScanDateString = date.toString();
          //console.log("id: " + vm.tags[i].tagID);

          if(i != vm.tagDataMonth.length - 1){
            //console.log("in if");
            date = new Date(vm.tagDataMonth[i].tagScanDate);
            datePlusOne = new Date(vm.tagDataMonth[i+1].tagScanDate);
            //console.log("datePlusOne - date: " + (datePlusOne - date));
            //console.log("vm.times_oneDay[tagIDlocal]: " + vm.times_oneDay[tagIDlocal]);
            if(typeof(vm.times_oneMonth[tagIDlocal]) == "undefined"){
              vm.times_oneMonth[tagIDlocal] = 0;
            }
            else {
              vm.times_oneMonth[tagIDlocal] += (datePlusOne - date);
            }
            //console.log("times length: " + vm.times_oneDay.length);
          }
      }

      vm.averages_oneMonth = [];

      for(var key in vm.counts_bar_oneMonth){
        //console.log("vm.times_oneDay[key]: " + vm.times_oneDay[key]);
        //console.log(key + ": " + vm.times_oneDay[key].toString());
        var temp = vm.times_oneMonth[key] / 1000;
        //console.log(key + ": " + temp + " seconds");
        temp = temp / 60;
        //console.log(key + ": " + temp + " minutes");

        //vm.averages_oneWeek[key] = temp / vm.counts_bar_oneWeek[key];

        vm.averages_oneMonth.push([key, vm.counts_bar_oneMonth[key], temp / vm.counts_bar_oneMonth[key]]);
        //console.log(vm.averages_oneMonth[key] + " minutes per visit to " + key);
        vm.averages_oneMonth[0][2].toFixed(2);

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
      //console.log(chart_barCounts_data); 


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

    tagsFactory.timeRange(startDate6Month, endDate, vm.patient.patientName)
    .success(function(data){
      //console.log("factory data: " + data);
      //console.log("call success");

      vm.tagDataSixMonth = data;
      //console.log(vm.tagDataSixMonth);
      vm.counts_bar_sixMonth = {};
      vm.times_sixMonth = {};

      for(i=0; i< vm.tagDataSixMonth.length; i++){
    
          tagIDlocal = vm.tagDataSixMonth[i].tagID;

          if(tagIDlocal != "Hallway-001"){
            typeof(vm.counts_bar_sixMonth[tagIDlocal]) == "undefined" ? vm.counts_bar_sixMonth[tagIDlocal] = 1 :
            vm.counts_bar_sixMonth[tagIDlocal] += 1;
          }
          //console.log("id: " + vm.tags[i].tagID);
          date = new Date(vm.tagDataSixMonth[i].tagScanDate);
          vm.tagDataSixMonth[i].tagScanDateString = date.toString();
        //console.log("id: " + vm.tags[i].tagID);

        if(i != vm.tagDataSixMonth.length - 1){
          //console.log("in if");
          date = new Date(vm.tagDataSixMonth[i].tagScanDate);
          datePlusOne = new Date(vm.tagDataSixMonth[i+1].tagScanDate);

          if(datePlusOne - date < 0){
            console.log("at: " + i);
            console.log("date: " + date);
            console.log("datePlusOne: " + datePlusOne);
          }
          //console.log("datePlusOne - date: " + (datePlusOne - date));
          //console.log("vm.times_oneDay[tagIDlocal]: " + vm.times_oneDay[tagIDlocal]);
          if(typeof(vm.times_sixMonth[tagIDlocal]) == "undefined"){
            vm.times_sixMonth[tagIDlocal] = 0;
          }
          else {
            vm.times_sixMonth[tagIDlocal] += (datePlusOne - date);
          }
          //console.log("times length: " + vm.times_oneDay.length);
        }
      }

      vm.averages_sixMonth = [];

      for(var key in vm.counts_bar_sixMonth){
        //console.log("vm.times_oneDay[key]: " + vm.times_oneDay[key]);
        //console.log(key + ": " + vm.times_oneDay[key].toString());
        var temp = vm.times_sixMonth[key] / 1000;
        //console.log(key + ": " + temp + " seconds");
        temp = temp / 60;
        //console.log(key + ": " + temp + " minutes");

        //vm.averages_oneWeek[key] = temp / vm.counts_bar_oneWeek[key];

        vm.averages_sixMonth.push([key, vm.counts_bar_sixMonth[key], temp / vm.counts_bar_sixMonth[key]]);
        //console.log(vm.averages_oneMonth[key] + " minutes per visit to " + key);
        vm.averages_sixMonth[0][2].toFixed(2);
      }

        //chartSelect = 0;

        vm.sixmonthSum = 0;

        var sortable = [];
        for (var key in vm.counts_bar_sixMonth){
          sortable.push([key, vm.counts_bar_sixMonth[key]]);
          vm.sixmonthSum += vm.counts_bar_sixMonth[key];
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
        //console.log(chart_barCounts_data); 

        var chart_barCounts_sixmonth = {};

        chart_barCounts_sixmonth.type = "Bar";
        chart_barCounts_sixmonth.cssStyle = "height:250px; width:325px; padding: 10px; vertical-align: middle; display: table-cell;";
        chart_barCounts_sixmonth.data = { "cols": [
            {id: "roomID", label: "Room", type: "string"},
            {id: "tagCounts", label: "Reads", type: "number"}
            ], "rows": chart_barCounts_data
          };

        chart_barCounts_sixmonth.options = {
          chart: {
            title:'Tag Scan Frequency',
            subtitle: 'Last  6 Months',
          },
          legend: { position: "none" }
        };

        chart_barCounts_sixmonth.formatters = {};
        $scope.chart_barCounts_sixmonth = chart_barCounts_sixmonth;
    });

    tagsFactory.timeRange(startDateYear, endDate, vm.patient.patientName)
    .success(function(data){
      //console.log("factory data: " + data);
      //console.log("call success");

      vm.tagDataYear = data;

      vm.counts_bar_Year = {};
      vm.times_oneYear = {};

      for(i=0; i< vm.tagDataYear.length; i++){
    
          tagIDlocal = vm.tagDataYear[i].tagID;

          if(tagIDlocal != "Hallway-001"){
            typeof(vm.counts_bar_Year[tagIDlocal]) == "undefined" ? vm.counts_bar_Year[tagIDlocal] = 1 :
            vm.counts_bar_Year[tagIDlocal] += 1;
            }

            date = new Date(vm.tagDataYear[i].tagScanDate);
          vm.tagDataYear[i].tagScanDateString = date.toString();
        //console.log("id: " + vm.tags[i].tagID);

        if(i != vm.tagDataYear.length - 1){
          //console.log("in if");
          date = new Date(vm.tagDataYear[i].tagScanDate);
          datePlusOne = new Date(vm.tagDataYear[i+1].tagScanDate);
          //console.log("datePlusOne - date: " + (datePlusOne - date));
          //console.log("vm.times_oneDay[tagIDlocal]: " + vm.times_oneDay[tagIDlocal]);
          if(typeof(vm.times_oneYear[tagIDlocal]) == "undefined"){
            vm.times_oneYear[tagIDlocal] = 0;
          }
          else {
            vm.times_oneYear[tagIDlocal] += (datePlusOne - date);
          }
          //console.log("times length: " + vm.times_oneDay.length);
        }
      }

      vm.averages_oneYear = [];

      for(var key in vm.counts_bar_Year){
        //console.log("vm.times_oneDay[key]: " + vm.times_oneDay[key]);
        //console.log(key + ": " + vm.times_oneDay[key].toString());
        var temp = vm.times_oneYear[key] / 1000;
        //console.log(key + ": " + temp + " seconds");
        temp = temp / 60;
        //console.log(key + ": " + temp + " minutes");

        //vm.averages_oneWeek[key] = temp / vm.counts_bar_oneWeek[key];

        vm.averages_oneYear.push([key, vm.counts_bar_Year[key], temp / vm.counts_bar_Year[key]]);
        //console.log(vm.averages_oneMonth[key] + " minutes per visit to " + key);
        vm.averages_oneYear[0][2].toFixed(2);

      }
        //console.log(vm.counts_bar_oneMonth);

        //chartSelect = 0;

        vm.YearSum = 0;

        var sortable = [];
        for (var key in vm.counts_bar_Year){
          sortable.push([key, vm.counts_bar_Year[key]]);
          vm.YearSum += vm.counts_bar_Year[key];
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
        //console.log(chart_barCounts_data); 

        var chart_barCounts_Year = {};

        chart_barCounts_Year.type = "Bar";
        chart_barCounts_Year.cssStyle = "height:250px; width:325px; padding: 10px; vertical-align: middle; display: table-cell;";
        chart_barCounts_Year.data = { "cols": [
            {id: "roomID", label: "Room", type: "string"},
            {id: "tagCounts", label: "Reads", type: "number"}
            ], "rows": chart_barCounts_data
          };

        chart_barCounts_Year.options = {
          chart: {
            title:'Tag Scan Frequency',
            subtitle: 'Last  Year',
          },
          legend: { position: "none" }
        };

        chart_barCounts_Year.formatters = {};
        $scope.chart_barCounts_Year = chart_barCounts_Year;
    });
  }
  
});