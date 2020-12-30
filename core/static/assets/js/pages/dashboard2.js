/* global Chart:false */

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
  obj.windspeed = []

  obj.so2 = []
  obj.no2 = []
  obj.co = []
  obj.o3 = []

  obj.no = []
  obj.nh3 = []

  for(let i = 0; i < data.length; i++){
    let tmp = data[i];
    obj.labels.push(tmp.created_date);
    obj.temp.push(tmp.temp);
    obj.humidity.push(tmp.humidity);
    obj.pressure.push(tmp.pressure);
    obj.pm1.push(tmp.pm1);
    obj.pm25.push(tmp.pm25);
    obj.pm10.push(tmp.pm10);
    obj.windspeed.push(tmp.windspeed)

    obj.so2.push(tmp.so2)
    obj.no2.push(tmp.no2)
    obj.co.push(tmp.co)
    obj.o3.push(tmp.o3)

    obj.no.push(tmp.no)
    obj.nh3.push(tmp.nh3)
  }
  return obj
}

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
        },
      }],
      yAxes: [{
        gridLines: {
          display: true
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 7
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
var windspeedChartCanvas = $('#windspeedChart').get(0).getContext('2d')

var so2ChartCanvas = $('#so2Chart').get(0).getContext('2d')
var no2ChartCanvas = $('#no2Chart').get(0).getContext('2d')
var coChartCanvas = $('#coChart').get(0).getContext('2d')
var o3ChartCanvas = $('#o3Chart').get(0).getContext('2d')

var noChartCanvas = $('#noChart').get(0).getContext('2d')
var nh3ChartCanvas = $('#nh3Chart').get(0).getContext('2d')

var tempChart, humidityChart, pressureChart, pm1Chart, pm25Chart, pm10Chart, windspeedChart, so2Chart, no2Chart, coChart, o3Chart, noChart, nh3Chart;

function distroyAll(){
  if(tempChart != null) tempChart.destroy();
  if(humidityChart != null) humidityChart.destroy();
  if(pressureChart != null) pressureChart.destroy();
  if(pm1Chart != null) pm1Chart.destroy();
  if(pm25Chart != null) pm25Chart.destroy();
  if(pm10Chart != null) pm10Chart.destroy();
  if(pm10Chart != null) pm10Chart.destroy();
  if(windspeedChart != null) windspeedChart.destroy();

  if(so2Chart != null) so2Chart.destroy();
  if(no2Chart != null) no2Chart.destroy();
  if(coChart != null) coChart.destroy();
  if(o3Chart != null) o3Chart.destroy();

  if(noChart != null) noChart.destroy();
  if(nh3Chart != null) nh3Chart.destroy();
}

function fetchData(type='all'){
  $.ajax({
    url: "api/data?type=" + type + "/",
    success: function(data) {
      distroyAll()
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
      windspeedChart = new Chart(windspeedChartCanvas, {
        type: 'line',
        data: createChartData(obj.labels, obj.windspeed, "Tốc độ gió"),
        options: createOptions(`Tốc độ gió: ${obj.labels[0]} - ${obj.labels[obj.labels.length-1]}`)
      }
      )

      so2Chart = new Chart(so2ChartCanvas, {
        type: 'line',
        data: createChartData(obj.labels, obj.so2, "So2"),
        options: createOptions(`So2: ${obj.labels[0]} - ${obj.labels[obj.labels.length-1]}`)
      }
      )
      
      no2Chart = new Chart(no2ChartCanvas, {
        type: 'line',
        data: createChartData(obj.labels, obj.no2, "No2"),
        options: createOptions(`No2: ${obj.labels[0]} - ${obj.labels[obj.labels.length-1]}`)
      }
      )

      coChart = new Chart(coChartCanvas, {
        type: 'line',
        data: createChartData(obj.labels, obj.co, "CO"),
        options: createOptions(`CO: ${obj.labels[0]} - ${obj.labels[obj.labels.length-1]}`)
      }
      )
      
      o3Chart = new Chart(o3ChartCanvas, {
        type: 'line',
        data: createChartData(obj.labels, obj.no2, "O3"),
        options: createOptions(`O3: ${obj.labels[0]} - ${obj.labels[obj.labels.length-1]}`)
      }
      )

      noChart = new Chart(noChartCanvas, {
        type: 'line',
        data: createChartData(obj.labels, obj.no2, "NO"),
        options: createOptions(`NO: ${obj.labels[0]} - ${obj.labels[obj.labels.length-1]}`)
      }
      )

      nh3Chart = new Chart(nh3ChartCanvas, {
        type: 'line',
        data: createChartData(obj.labels, obj.no2, "NH3"),
        options: createOptions(`NH3: ${obj.labels[0]} - ${obj.labels[obj.labels.length-1]}`)
      }
      )
    },
    error: function(err) {
      console.log(err)
    }
  } )
}


function fetchRealtimeData(){
  $.ajax({
    url: "api/data/realtime/",
    success: function(data) {
      $('#rt_temp').html(`${data.temp} <small>&#8451;</small>`);
      $('#rt_humidity').html(`${data.humidity} <small>%</small>`);
      $('#rt_pressure').html(`${data.pressure} <small>hpa</small>`);
      $('#rt_pm1').html(`${data.pm1} <small>&#181;/m<sup>3</sup></small>`);
      $('#rt_pm25').html(`${data.pm25} <small>&#181;/m<sup>3</sup></small>`);
      $('#rt_pm10').html(`${data.pm10} <small>&#181;/m<sup>3</sup></small>`);

      $('#rt_so2').html(`${data.so2} <small>&#181;/m<sup>3</sup></small>`);
      $('#rt_no2').html(`${data.no2} <small>&#181;/m<sup>3</sup></small>`);
      $('#rt_co').html(`${data.co} <small>&#181;/m<sup>3</sup></small>`);
      $('#rt_o3').html(`${data.o3} <small>&#181;/m<sup>3</sup></small>`);
      
      $('#rt_no').html(`${data.no} <small>&#181;/m<sup>3</sup></small>`);
      $('#rt_nh3').html(`${data.nh3} <small>&#181;/m<sup>3</sup></small>`);
    },
    error: function(err) {
      console.log(err)
    }
  } )
}
fetchRealtimeData()
fetchData()
var loopRealtime = setInterval(fetchRealtimeData, 1000);
var loopData = setInterval(fetchData, 5000);

$('#direct-chat-messages').append(`<div class="direct-chat-msg">
<div class="direct-chat-infos clearfix">
  <span class="direct-chat-name float-left">Server</span>
  <span class="direct-chat-timestamp float-right">${"23 Jan 2:00 pm"}</span>
</div>
<div class="direct-chat-text">
  ${"Bụi mịn cao"}
</div>
</div>`);

$(function () {
  'use strict'
})
