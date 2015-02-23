angular.module('homeCtrl', ['tagsService', 'patientService'])

.controller('homeController', function(patientFactory, tagsFactory){
  var vm = this;

  vm.message = 'home';

  patientFactory.all()
  .success(function(data){
    vm.patients = data;

    vm.options = vm.patients;
    //vm.selectedPatient = vm.options[0].patientName;
    console.log(vm.options[0].patientName);

    //console.log("vm.options: " + JSON.stringify(vm.options));
    
    console.log('Get patients worked!');
  });


  google.load('visualization', '1.0',{
  	'packages':['corechart'],
  	callback: function() {
  		drawChart();
  	}

	});
  
  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
  function drawChart(inputData) {

  	var i = 0;
  	var keys = [];
  	for (var key in inputData) {
  		keys[i]=key;
  		i++;
    	//console.log(inputData[key]);
	}

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Reads');
    for (var key in inputData) {
	    data.addRows([
	      [key, inputData[key]]
	    ]);
	}

	var color = $(".jumbotron").css("background-color");

    // Set chart options
    var options = {'title':'Tag Data Frequency',
                   'width':500,
                   'height':400,
                   'backgroundColor': color
                   //'backgroundColor': $('.jumbotron').backgroundColor
               		};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data, options);    
  }

  vm.getOneWeek = function(){

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

  	var startDate = new Date(endDate - day - hour*6);

  	console.log("end date: " + endDate);
  	console.log("start date: " + startDate);

  	tagsFactory.timeRange(startDate, endDate)
  	.success(function(data){
  		console.log("factory data: " + data);
  		console.log("call success");

  		vm.tags = data;
  		vm.counts = {};

  		for(i=0; i< vm.tags.length; i++)
  		{
    
	        tagIDlocal = vm.tags[i].tagID;

	        typeof(vm.counts[tagIDlocal]) == "undefined" ? vm.counts[tagIDlocal] = 1 :
	        vm.counts[tagIDlocal] += 1;
	        date = new Date(vm.tags[i].tagScanDate);
	        vm.tags[i].tagScanDateString = date.toString();

	        //console.log("id: " + vm.tags[i].tagID);
 
      	}
      	console.log(vm.counts);

      	drawChart(vm.counts);
  	});

  	};
});