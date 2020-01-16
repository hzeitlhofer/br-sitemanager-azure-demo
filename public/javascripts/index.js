$(document).ready(function () {
  var timeData = [],
    customData = [];
    greenData = [];
    redData = [];

  var data = {
    labels: timeData,
    datasets: [
      {
        fill: false,
        label: 'Potentiometer',
        yAxisID: 'Potentiometer',
        borderColor: "rgba(24, 120, 240, 1)",
        pointBoarderColor: "rgba(24, 120, 240, 1)",
        backgroundColor: "rgba(24, 120, 240, 0.4)",
        pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
        pointHoverBorderColor: "rgba(24, 120, 240, 1)",
        data: customData
      },
      {
        fill: true,
        label: 'hide',
        pointRadius: 0,
        steppedLine: 'after',
        borderWidth: 0,
        yAxisID: 'Button',
        data: greenData,
        backgroundColor: "rgba(0, 255, 0, 0.4)",
      },
      {
        fill: true,
        label: 'hide',
        pointRadius: 0,
        steppedLine: 'after',
        borderWidth: 0,
        yAxisID: 'Button',
        data: redData,
        backgroundColor: "rgba(255, 0, 0, 0.4)",
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
          id: 'Potentiometer',
          type: 'linear',
          scaleLabel: {
            labelString: 'Potentiometer Position',
            display: true
          },
          ticks: {
            min: 0,
            max: 35000
          },          
          position: 'right'
       }, {
        id: 'Button',
        type: 'linear',
        display: false,
        ticks: {
          min: 0,
          max: 1
        },          
      }]
    },
    legend: {
     labels: {
        filter: function(item, chart) {
          // Logic to remove a particular legend item goes here
          return !item.text.includes('hide');
        }
      }
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
    var data = message.data; //.substring(0, message.data.length - 1);
    try {
      var obj = JSON.parse(data);
      var switchPos = 0;

      for (i in obj.v) {

        var o = obj.v[i];
        console.log (o);

        if (o.SchalterLinks !== undefined) {
          if (o.SchalterLinks) {
            switchPos = -1; 
            $("#leftarrow").show();
          } else {
            $("#leftarrow").hide();
          }
        }

        if (o.SchalterRechts !== undefined) {
          if (o.SchalterRechts) {
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


        if (o.ButtonGruen !== undefined) {
          if (o.ButtonGruen) {
            $("#greenbox").addClass("green");
          } else {
            $("#greenbox").removeClass("green");
          }
        }

        if (o.ButtonRot !== undefined) {
          if (o.ButtonRot) {
            $("#redbox").addClass("red");
          } else {
            $("#redbox").removeClass("red");
          }
        }

        if (o.Potentiometer !== undefined) {
//          var ts = new Date(o.ts).toTimeString();
          timeData.push("");
          customData.push(o.Potentiometer);
        }

        if (o.ButtonGruen !== undefined) {
          greenData.push(o.ButtonGruen);
        }

        if (o.ButtonRot !== undefined) {
          redData.push(o.ButtonRot);
        }

        const maxLen = 100;
        var len = timeData.length;
        
        if (len > maxLen) {
          timeData.shift();
          customData.shift();
          greenData.shift();
          redData.shift();
        }
        myLineChart.update();
      }
    } catch (err) {
      console.error(err);
    }
  }
});
