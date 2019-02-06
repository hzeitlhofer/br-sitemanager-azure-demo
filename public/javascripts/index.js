$(document).ready(function () {
  var timeData = [],
    temperatureData = [],
    customData = [];
  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Temperature',
        yAxisID: 'Temperature',
        borderColor: "rgba(255, 204, 0, 1)",
        pointBoarderColor: "rgba(255, 204, 0, 1)",
        backgroundColor: "rgba(255, 204, 0, 0.4)",
        pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
        pointHoverBorderColor: "rgba(255, 204, 0, 1)",
        data: temperatureData
      },
      {
        fill: false,
        label: 'Wheel',
        yAxisID: 'Wheel',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: customData
      }
    ]
  }

  var basicOption = {
    title: {
      display: true,
      text: 'B&R SiteManager Demo',
      fontSize: 36
    },
    scales: {
      yAxes: [{
        id: 'Temperature',
        type: 'linear',
        scaleLabel: {
          labelString: 'Temperature(C)',
          display: true
        },
        position: 'left',
      }, {
          id: 'Wheel',
          type: 'linear',
          scaleLabel: {
            labelString: 'Wheel Position',
            display: true
          },
          position: 'right'
        }]
    }
  }

  //Get the context of the canvas element we want to select
  var ctx = document.getElementById("myChart").getContext("2d");
  var optionsNoAnimation = { animation: false }
  var myLineChart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: basicOption
  });

  $("#noarrow").show();

  var ws = new WebSocket('wss://' + location.host);
  ws.onopen = function () {
    console.log('Successfully connect WebSocket');
  }
  ws.onmessage = function (message) {
    var data = message.data.substring(0, message.data.length - 1);
    try {
      var obj = JSON.parse(data);
      var switchPos = 0;

      for (i in obj.v) {

        var o = obj.v[i];

        if (o.Left !== undefined) {
          if (o.Left) {
            switchPos = -1; 
            $("#leftarrow").show();
          } else {
            $("#leftarrow").hide();
          }
        }

        if (o.Right !== undefined) {
          if (o.Right) {
            switchPos = 1; 
            $("#rightarrow").show();
            $("#noarrow").hide();
          } else {
            $("#rightarrow").hide();
          }
        }
        
        if ($("#leftarrow").is(":visible") || $("#rightarrow").is(":visible")) {
          $("#noarrow").hide();
        } else {
          $("#noarrow").show();
        }


        if (o.GreenButton !== undefined) {
          if (o.GreenButton) {
            $("#greenbox").addClass("green");
          } else {
            $("#greenbox").removeClass("green");
          }
        }

        if (o.RedButton !== undefined) {
          if (o.RedButton) {
            $("#redbox").addClass("red");
          } else {
            $("#redbox").removeClass("red");
          }
        }

        if (o.Wheel) {
//          var ts = new Date(o.ts).toTimeString();
          timeData.push("");
          temperatureData.push(25);
          customData.push(o.Wheel);

          const maxLen = 100;
          var len = timeData.length;
          
          if (len > maxLen) {
            timeData.shift();
            temperatureData.shift();
            customData.shift();
          }
          myLineChart.update();
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
});
