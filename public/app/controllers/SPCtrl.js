angular.module('SPCtrl', ['tagsService', 'patientService'])

.controller('SPController', function(patientFactory, tagsFactory, $routeParams){
  var vm = this;

  vm.message = 'sp';

  patientFactory.get($routeParams.patient_id)
  .success(function(data){
    vm.patient = data;

    console.log(vm.patient);
  });


  google.load('visualization', '1.0',{
  	'packages':['corechart'],
  	callback: function() {
  		drawChart();
  	}

	});
  
  var chartSelect = 0;
  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
  function drawChart(){

    if (chartSelect == 0) inputData_bar=vm.counts_bar_oneWeek;
    if (chartSelect == 1) inputData_bar=vm.counts_bar_oneDay;

  	var i = 0;
  	var keys = [];
  	for (var key in inputData_bar) {
  		keys[i]=key;
  		i++;
    	//console.log(inputData_bar[key]);
    }

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Room');
    data.addColumn('number', 'Reads');
    for (var key in inputData_bar) {
	    data.addRows([
	      [key, inputData_bar[key]]
	    ]);
	  }

    var data2 = new google.visualization.DataTable();
    data2.addColumn('number','Room');
    for(var key2 in vm.counts_line_oneWeek){
      data2.addColumn('number', key2);
    }

    //for()
    for(key2 in vm.counts_line_oneWeek){
      data2.addRow('number', key2);
    }

	  var color = $(".jumbotron").css("background-color");

    // Set chart options
    var options = {'title':'Tag Data Frequency',
                   'width':500,
                   'height':400,
                   'backgroundColor': color
                   //'backgroundColor': $('.jumbotron').backgroundColor
               		};

    var options2 = {'title':'Tag Data Frequencys',
                   'width':1000,
                   'height':500,
                   'backgroundColor': color
                   //'backgroundColor': $('.jumbotron').backgroundColor
                  };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div_bar'));
    chart.draw(data, options);

    var chart2 = new google.visualization.LineChart(document.getElementById('chart_div_line_activity')); 
    chart2.draw(data2, options2);   
  }

  vm.graph_line_oneWeek = function(){

    console.log("Graph line 1 week");

    var endDate = new Date();
    endDate.setHours(0);
    endDate.setMinutes(0);
    endDate.setSeconds(0);
    endDate.setMilliseconds(0);

    var second = 1000;
    var minute = 60 * second;
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;

    var startDate = new Date(endDate - week);

    console.log("end date: " + endDate);
    console.log("start date: " + startDate);

    tagsFactory.timeRange(startDate, endDate, vm.patient.patientName)
    .success(function(data){
      console.log("factory data: " + data);
      console.log("call success");

      vm.tags = data;
      vm.counts_line_oneWeek = {};

      for(i=0; i< vm.tags.length; i++)
      {
    
          tagIDlocal = vm.tags[i].tagID;

          typeof(vm.counts_line_oneWeek[tagIDlocal]) == "undefined" ? vm.counts_line_oneWeek[tagIDlocal] = 1 :
          vm.counts_line_oneWeek[tagIDlocal] += 1;
          date = new Date(vm.tags[i].tagScanDate);
          vm.tags[i].tagScanDateString = date.toString();

          //console.log("id: " + vm.tags[i].tagID);
 
        }
        console.log(vm.counts_line_oneWeek);

        drawChart();
    });
  };

  vm.graph_bar_oneWeek = function(){

  	console.log("Get 1 week");

  	var endDate = new Date();
  	endDate.setHours(0);
  	endDate.setMinutes(0);
  	endDate.setSeconds(0);
  	endDate.setMilliseconds(0);

  	var second = 1000;
  	var minute = 60 * second;
  	var hour = minute * 60;
  	var day = hour * 24;
  	var week = day * 7;

  	var startDate = new Date(endDate - week);

  	console.log("end date: " + endDate);
  	console.log("start date: " + startDate);

  	tagsFactory.timeRange(startDate, endDate, vm.patient.patientName)
  	.success(function(data){
  		console.log("factory data: " + data);
  		console.log("call success");

  		vm.tags = data;
  		vm.counts_bar_oneWeek = {};

  		for(i=0; i< vm.tags.length; i++)
  		{
    
	        tagIDlocal = vm.tags[i].tagID;

          if(tagIDlocal != "Hallway-001"){
	        typeof(vm.counts_bar_oneWeek[tagIDlocal]) == "undefined" ? vm.counts_bar_oneWeek[tagIDlocal] = 1 :
	        vm.counts_bar_oneWeek[tagIDlocal] += 1;
	        date = new Date(vm.tags[i].tagScanDate);
	        vm.tags[i].tagScanDateString = date.toString();
          }

	        //console.log("id: " + vm.tags[i].tagID);
 
      	}
      	console.log(vm.counts_bar_oneWeek);

        chartSelect = 0;
      	drawChart();
  	});
  };

  vm.graph_bar_oneDay = function(){

    console.log("Get 1 day");

    var endDate = new Date();
    endDate.setHours(0);
    endDate.setMinutes(0);
    endDate.setSeconds(0);
    endDate.setMilliseconds(0);

    var second = 1000;
    var minute = 60 * second;
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;

    var startDate = new Date(endDate - day);

    //console.log("end date: " + endDate);
    //console.log("start date: " + startDate);
    //console.log("patient name: " + vm.patient.patientName);

    tagsFactory.timeRange(startDate, endDate, vm.patient.patientName)
    .success(function(data){
      console.log("factory data: " + data);
      console.log("call success");

      vm.tags = data;
      vm.counts_bar_oneDay = {};

      for(i=0; i< vm.tags.length; i++)
      {
    
          tagIDlocal = vm.tags[i].tagID;

          if(tagIDlocal != "Hallway-001"){
          typeof(vm.counts_bar_oneDay[tagIDlocal]) == "undefined" ? vm.counts_bar_oneDay[tagIDlocal] = 1 :
          vm.counts_bar_oneDay[tagIDlocal] += 1;
          date = new Date(vm.tags[i].tagScanDate);
          vm.tags[i].tagScanDateString = date.toString();
        }

          //console.log("id: " + vm.tags[i].tagID);
 
        }
        console.log(vm.counts_bar_oneDay);

        chartSelect = 1;
        drawChart();
    });
  };
});