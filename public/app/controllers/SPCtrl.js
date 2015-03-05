angular.module('SPCtrl', ['tagsService', 'patientService', 'googlechart'])

.controller('SPController', function(patientFactory, tagsFactory, $routeParams, $scope){
  var vm = this;

  vm.message = 'sp';

  patientFactory.get($routeParams.patient_id)
  .success(function(data){
    vm.patient = data;

    console.log(vm.patient);

    
    computeData(function(){
      drawChart();
    });
    
  
  });

  var chart1 ={};

  chart1.type = "ColumnChart";
  chart1.cssStyle = "height:175px; width:250px;";
  chart1.data = {"cols": [
        {id: "month", label: "Month", type: "string"},
        {id: "laptop-id", label: "Laptop", type: "number"},
        {id: "desktop-id", label: "Desktop", type: "number"},
        {id: "server-id", label: "Server", type: "number"},
        {id: "cost-id", label: "Shipping", type: "number"}
    ], "rows": [
        {c: [
            {v: "January"},
            {v: 19, f: "42 items"},
            {v: 12, f: "Ony 12 items"},
            {v: 7, f: "7 servers"},
            {v: 4}
        ]},
        {c: [
            {v: "February"},
            {v: 13},
            {v: 1, f: "1 unit (Out of stock this month)"},
            {v: 12},
            {v: 2}
        ]},
        {c: [
            {v: "March"},
            {v: 24},
            {v: 0},
            {v: 11},
            {v: 6}

        ]}
    ]};

    chart1.options = {
        "title": "Sales per month",
        "isStacked": "true",
        "fill": 20,
        "displayExactValues": true,
        "vAxis": {
            "title": "Sales unit", "gridlines": {"count": 6}
        },
        "hAxis": {
            "title": "Date"
        }
    };

    chart1.formatters = {};

    $scope.chart = chart1;

    console.log("vm.chart: " + vm.chart);

    /*
    var dataTable1 = new google.visualization.DataTable();
    dataTable1.addColumn('string', 'Room');
    dataTable1.addColumn('number', 'Reads');
    for (var key in inputData_bar) {
      dataTable1.addRows([
        [key, inputData_bar[key]]
      ]);
    }
    */

    var chart_barCounts = {};

    chart_barCounts.type = "BarChart";
    chart_barCounts.cssStyle = "height:175px; width:250px;";
    chart_barCounts.data = { "cols": [
      {id: "roomID", label: "Room", type: "string"},
      {id: "tagCounts", label: "Reads", type: "number"}
      ], "rows":[{c: {v: 12}}, {c: {v: 15}}, {c: {v: 25}}]
      };

    chart_barCounts.options = {
        "title": "Sales per month",
        "fill": 20,
        "displayExactValues": true,
        "vAxis": {
            "title": "Sales unit", "gridlines": {"count": 6}
        },
        "hAxis": {
            "title": "Date"
        }
    };

    chart1.formatters = {};

    $scope.chart_barCounts = chart_barCounts;


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

    var endDate = endDate - day;
    var startDateDay = new Date(endDate - day);
    var startDateWeek = new Date(endDate - week);

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

      //console.log(vm.counts_bar_oneDay);

      chartSelect = 1;
      drawChart();
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

      console.log(vm.counts_bar_oneWeek);

      chartSelect = 0;
      console.log("drawing timeline chart");
      drawChart();
    });

    //drawChart();
  }

  //--------------------------------------


  google.load('visualization', '1.1',{
    'packages':['corechart', 'timeline', 'bar'],
    callback: function() {
      computeData();
    }
  });

  chartSelect = 0;
  
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
    var dataTable1 = new google.visualization.DataTable();
    dataTable1.addColumn('string', 'Room');
    dataTable1.addColumn('number', 'Reads');
    for (var key in inputData_bar) {
	    dataTable1.addRows([
	      [key, inputData_bar[key]]
	    ]);
	  }

    var data2 = new google.visualization.DataTable();
    data2.addColumn('number','Room');
    for(var key2 in vm.counts_line_oneWeek){
      console.log("adding column: " + key2);
      data2.addColumn('number', key2);
    }

    //for()
    for(key2 in vm.counts_line_oneWeek){
      data2.addRow([1, 
        vm.counts_line_oneWeek[0],
        vm.counts_line_oneWeek[1],
        vm.counts_line_oneWeek[2],
        vm.counts_line_oneWeek[3],
        vm.counts_line_oneWeek[4],
        vm.counts_line_oneWeek[5]]

        );
    }

    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'string', id: 'Room' });
    dataTable.addColumn({ type: 'date', id: 'Start' });
    dataTable.addColumn({ type: 'date', id: 'End' });
    dataTable.addRows(vm.tagDataDay.length-1);
    for(var i=0; i< vm.tagDataDay.length-1; i++){
      dataTable.setValue(i, 0, vm.tagDataDay[i].tagID)
      dataTable.setValue(i, 1, new Date(vm.tagDataDay[i].tagScanDate))
      dataTable.setValue(i, 2, new Date(vm.tagDataDay[i+1].tagScanDate))
    }

	  var color = $(".jumbotron").css("background-color");

    // Set chart options
    var options = {
                   chart: {
                    title:'Tag Scan Frequency',
                    subtitle: 'Last 24 Hours',
                    },
                    legend: { position: "none" },
                    'width': 400,
                    'height': 300

                   //'backgroundColor': color
               		};

    var options2 = {'title':'Tag Data Frequencys',
                   'width':1000,
                   'height':500,
                   'backgroundColor': color
                   //'backgroundColor': $('.jumbotron').backgroundColor
                  };

    var options3 = {
                    'height': 300,
                    timeline: { colorByRowLabel: true },
                    'title': '24-Hour Patient Time Line', //not available for timeline
                    'backgroundColor': '#ffd',
                    'hAxis': {title: 'Time',  titleTextStyle: {color: 'red'}}//not available for timeline
                  };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.charts.Bar(document.getElementById('chart_div_bar'));
    chart.draw(dataTable1, options);
    /*
    var chart2 = new google.visualization.LineChart(document.getElementById('chart_div_line_activity')); 
    chart2.draw(data2, options2);

    var chart3 = new google.visualization.Timeline(document.getElementById('chart_div_line_activity'));
    chart3.draw(dataTable, options3);
    */

  }

  /*
  vm.graph_timeline_oneDay = function(){

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

    var startDate = new Date(endDate - day);

    console.log("end date: " + endDate);
    console.log("start date: " + startDate);

    tagsFactory.timeRange(startDate, endDate, vm.patient.patientName)
    .success(function(data){
      console.log("factory data: " + data);
      console.log("call success");

      vm.tagData = data;
    });
  };


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
    });
  };
  */

  vm.graph_bar_oneWeek = function(){
      chartSelect = 0;
      drawChart();
  };

  vm.graph_bar_oneDay = function(){

    chartSelect = 1;
    drawChart();
  };
  
});