// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Bar Chart Example
var ctx = document.getElementById("myBarChart");
var myLineChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ["N01", "N02", "N03", "N04", "N05", "N06"],
    datasets: [{
      label: "Current Vol. (%)",
      backgroundColor: ["blue","blue","red","blue","blue","red"],
      data: [80, 93.3, 92, 83, 95, 90],
    }],
  },
  options: {
    tooltips: {
      callbacks: {
          label: function(tooltipItem) {
              let state;
              let ct;
              if(tooltipItem.xLabel == 'N01'){
                state = 'stable'
              }
              if(tooltipItem.xLabel == 'N02'){
                state = 'stable';
              }
              if(tooltipItem.xLabel == 'N03'){
                state = 'empting'
                ct = '278 days';
              }
              if(tooltipItem.xLabel == 'N04'){
                state = 'stable'
              }
              if(tooltipItem.xLabel == 'N05'){
                state = 'stable'
              }
              if(tooltipItem.xLabel == 'N06'){
                state = 'empting'
                ct = '145 days';
              }
              if(ct != null)
                return "Current Vol: " + Number(tooltipItem.yLabel) + "%" + "\nStatus: " + state + "\nTime: " + ct;
              else
                return "Current Vol: " + Number(tooltipItem.yLabel) + "%" + "\nStatus: " + state;
          }
      }
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [{
        time: {
          unit: 'month'
        },
        gridLines: {
          display: false
        },
        ticks: {
          maxTicksLimit: 6
        }
      }],
      yAxes: [{
        ticks: {
          min: 0,
          max: 100,
          maxTicksLimit: 5
        },
        gridLines: {
          display: true
        }
      }],
    },
    legend: {
      display: true
    }
  }
});
