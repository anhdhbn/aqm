/* global Chart:false */

$(function () {
  'use strict'
  window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  };

  Array.prototype.max = function() {
    return Math.max.apply(null, this);
  };

  function clearData(data) {
    let obj = {}
    obj.labels = []
    obj.temp = []
    obj.humidity = []
    obj.pressure = []
    obj.pm1 = []
    obj.pm25 = []
    obj.pm10 = []
    for(let i = 0; i < data.length; i++){
      let tmp = data[i];
      obj.labels.push(tmp.created_date);
      obj.temp.push(tmp.temp);
      obj.humidity.push(tmp.humidity);
      obj.pressure.push(tmp.pressure);
      obj.pm1.push(tmp.pm1);
      obj.pm25.push(tmp.pm25);
      obj.pm10.push(tmp.pm10);
    }
    return obj
  }

  
  /* ChartJS
   * -------
   * Here we will create a few charts using ChartJS
   */

  //-----------------------
  // - MONTHLY SALES CHART -
  //-----------------------
  function createOptions(title){
    return {
      maintainAspectRatio: false,
      responsive: true,
      title: {
        display: true,
        text: title
      },
      legend: {
        display: false
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: true
          }
        }],
        yAxes: [{
          gridLines: {
            display: true
          }
        }]
      }
    }
  }

  function generateMinMaxArr(arr, func){
    let min_max = func(...arr);
    let arr_min_max = []
    for(let i = 0; i < arr.length; i++){
      arr_min_max.push(min_max);
    }
    return arr_min_max;
  }

  function createChartData(labels, data, labelData){
    return {
      labels: labels,
      datasets: [
        {
          label: 'Đỉnh',
          backgroundColor: window.chartColors.red,
          borderColor: window.chartColors.red,
          fill: false,
          data: generateMinMaxArr(data, Math.max),
          pointRadius: false,
        },
        {
          fill: false,
          label: labelData,
          backgroundColor: 'rgba(60,141,188,0.9)',
          borderColor: 'rgba(60,141,188,0.8)',
          pointColor: '#3b8bba',
          pointStrokeColor: 'rgba(60,141,188,1)',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(60,141,188,1)',
          data: data
        },
        // {
        //   fill: false,
        //   label: 'Electronics',
        //   backgroundColor: 'rgba(210, 214, 222, 1)',
        //   borderColor: 'rgba(210, 214, 222, 1)',
        //   pointRadius: false,
        //   pointColor: 'rgba(210, 214, 222, 1)',
        //   pointStrokeColor: '#c1c7d1',
        //   pointHighlightFill: '#fff',
        //   pointHighlightStroke: 'rgba(220,220,220,1)',
        //   data: [65, 59, 80, 81, 56, 55, 40]
        // },
        {
          label: 'Đáy',
          backgroundColor: window.chartColors.purple,
          borderColor: window.chartColors.purple,
          fill: false,
          data: generateMinMaxArr(data, Math.min),
          pointRadius: false,
        },
      ]
    }
  }

  
  // Get context with jQuery - using jQuery's .get() method.
  var tempChartCanvas = $('#tempChart').get(0).getContext('2d')
  var humidityChartCanvas = $('#humidityChart').get(0).getContext('2d')
  var pressureChartCanvas = $('#pressureChart').get(0).getContext('2d')
  var pm1ChartCanvas = $('#pm1Chart').get(0).getContext('2d')
  var pm25ChartCanvas = $('#pm25Chart').get(0).getContext('2d')
  var pm10ChartCanvas = $('#pm10Chart').get(0).getContext('2d')

  var tempChart, humidityChart, pressureChart, pm1Chart, pm25Chart, pm10Chart;

  function distroyAll(){
    if(tempChart != null) tempChart.destroy();
    if(humidityChart != null) humidityChart.destroy();
    if(pressureChart != null) pressureChart.destroy();
    if(pm1Chart != null) pm1Chart.destroy();
    if(pm25Chart != null) pm25Chart.destroy();
    if(pm10Chart != null) pm10Chart.destroy();
  }

  function fetchData(type='all'){
    $.ajax({
      url: "api/data?type=" + type,
      success: function(data) {
        let obj = clearData(data);

        tempChart = new Chart(tempChartCanvas, {
          type: 'line',
          data: createChartData(obj.labels, obj.temp, "Nhiệt độ"),
          options: createOptions(`Nhiệt độ: ${obj.labels[0]} - ${obj.labels[obj.labels.length-1]}`)
        }
        )

        humidityChart = new Chart(humidityChartCanvas, {
          type: 'line',
          data: createChartData(obj.labels, obj.humidity, "Độ ẩm"),
          options: createOptions(`Độ ẩm: ${obj.labels[0]} - ${obj.labels[obj.labels.length-1]}`)
        }
        )

        pressureChart = new Chart(pressureChartCanvas, {
          type: 'line',
          data: createChartData(obj.labels, obj.pressure, "Áp suât khí"),
          options: createOptions(`Áp suât khí: ${obj.labels[0]} - ${obj.labels[obj.labels.length-1]}`)
        }
        )
        
        pm1Chart = new Chart(pm1ChartCanvas, {
          type: 'line',
          data: createChartData(obj.labels, obj.pm1, "PM1"),
          options: createOptions(`PM1: ${obj.labels[0]} - ${obj.labels[obj.labels.length-1]}`)
        }
        )

        pm25Chart = new Chart(pm25ChartCanvas, {
          type: 'line',
          data: createChartData(obj.labels, obj.pm25, "PM2.5"),
          options: createOptions(`PM2.5": ${obj.labels[0]} - ${obj.labels[obj.labels.length-1]}`)
        }
        )

        pm10Chart = new Chart(pm10ChartCanvas, {
          type: 'line',
          data: createChartData(obj.labels, obj.pm10, "PM10"),
          options: createOptions(`PM10: ${obj.labels[0]} - ${obj.labels[obj.labels.length-1]}`)
        }
        )

      },
      error: function(err) {
        console.log(err)
      }
    } )
  }
  fetchData()


  var salesChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        fill: false,
        label: 'Digital Goods',
        backgroundColor: 'rgba(60,141,188,0.9)',
        borderColor: 'rgba(60,141,188,0.8)',
        pointRadius: false,
        pointColor: '#3b8bba',
        pointStrokeColor: 'rgba(60,141,188,1)',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(60,141,188,1)',
        data: [28, 48, 40, 19, 86, 27, 90]
      },
      {
        fill: false,
        label: 'Electronics',
        backgroundColor: 'rgba(210, 214, 222, 1)',
        borderColor: 'rgba(210, 214, 222, 1)',
        pointRadius: false,
        pointColor: 'rgba(210, 214, 222, 1)',
        pointStrokeColor: '#c1c7d1',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  }

  // This will get the first returned node in the jQuery collection.
  // eslint-disable-next-line no-unused-vars
  // var tempChart = new Chart(tempChartCanvas, {
  //   type: 'line',
  //   data: createChartData(['January', 'February', 'March', 'April', 'May', 'June', 'July'], [28, 48, 40, 19, 86, 27, 90], "Nhiệt độ"),
  //   options: createOptions("Nhiệt độ: 01/01/2018 - 30/10/2020")
  // }
  // )
  // humidityChart.destroy();
  // humidityChart = new Chart(humidityChartCanvas, {
  //   type: 'line',
  //   data: salesChartData,
  //   options: createOptions("Độ ẩm: 01/01/2018 - 30/10/2020")
  // }
  // )

  // var pressureChart = new Chart(pressureChartCanvas, {
  //   type: 'line',
  //   data: salesChartData,
  //   options: createOptions("Áp suât: 01/01/2018 - 30/10/2020")
  // }
  // )


  // var pm1Chart = new Chart(pm1ChartCanvas, {
  //   type: 'line',
  //   data: salesChartData,
  //   options: createOptions("PM1: 01/01/2018 - 30/10/2020")
  // }
  // )

  // var pm25Chart = new Chart(pm25ChartCanvas, {
  //   type: 'line',
  //   data: salesChartData,
  //   options: createOptions("PM2.5: 01/01/2018 - 30/10/2020")
  // }
  // )

  // var pm10Chart = new Chart(pm10ChartCanvas, {
  //   type: 'line',
  //   data: salesChartData,
  //   options: createOptions("PM10: 01/01/2018 - 30/10/2020")
  // }
  // )

  //---------------------------
  // - END MONTHLY SALES CHART -
  //---------------------------

  //-------------
  // - PIE CHART -
  //-------------
  // Get context with jQuery - using jQuery's .get() method.
  var pieChartCanvas = $('#pieChart').get(0).getContext('2d')
  var pieData = {
    labels: [
      'Chrome',
      'IE',
      'FireFox',
      'Safari',
      'Opera',
      'Navigator'
    ],
    datasets: [
      {
        data: [700, 500, 400, 600, 300, 100],
        backgroundColor: ['#f56954', '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#d2d6de']
      }
    ]
  }
  var pieOptions = {
    legend: {
      display: false
    }
  }
  // Create pie or douhnut chart
  // You can switch between pie and douhnut using the method below.
  // eslint-disable-next-line no-unused-vars
  var pieChart = new Chart(pieChartCanvas, {
    type: 'doughnut',
    data: pieData,
    options: pieOptions
  })

  //-----------------
  // - END PIE CHART -
  //-----------------

})
