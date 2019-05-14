(function() {
  var HOST = location.origin.replace(/^http/, 'ws');
  var ws = new WebSocket(HOST);
  var numberElements = 300;
  var chartTest = document.getElementById('myChart');

  const LED_ACTION = "led_action";
  const LED_VALUE_ACTION = "led_value";
  const CONNECT_VALUE_ACTION = "connect_value";
  const CONNECT_ACTION = "connect_action";
  const CLOSE_ACTION = "close_action";

  const CONNECT_LABEL = "Connexion";
  const CONNECT_VALUE = "connected";
  const DISCONNECT_LABEL = "Disconnexion";
  const DISCONNECT_VALUE = "disconnected";

  //Globals
  var updateCount = 0;

  // Chart config
  var chartTestInstance = new Chart(chartTest, {
      type: 'line',
      data: {
      datasets: [{ 
          data: [],
          label: "Test",
          borderColor: "#3e95cd",
          fill: false
        }
      ]
    },
    options: {
      title: {
        display: false,
        text: 'Chart test'
      },
      scales: {
        xAxes: [{
          type: 'time',
          time: {
            displayFormats: {
              millisecond: 'mm:ss:SSS'
            }
          }
        }],
        yAxis: [{
          ticks: {
            max: 2,
            min: -1,
            stepSize: 0.5,
            suggestedMin: -1,
            suggestedMax: -2
          }
        }]
      },
      legend: {
        display: false
      }
    }
  });
  
  function sendAction(type, value) {
    var msg = { type, value };
    ws.send(JSON.stringify(msg));
  }

  function addValueToChart(value){
    chartTestInstance.data.labels.push(new Date());
    chartTestInstance.data.datasets[0].data.push(value);
    
    if(updateCount > numberElements){
      chartTestInstance.data.labels.shift();
      chartTestInstance.data.datasets[0].data.shift();
    }
    else updateCount++;
    chartTestInstance.update();
  }
  // equal to `function updateConnectBtn(value){...}`
  const updateConnectBtn = value => {
    var btnLabel, classToRemove, classToAdd, valBtn;
    if(value) {
      btnLabel = DISCONNECT_LABEL;
      classToRemove = "btn-success";
      classToAdd = "btn-danger";
      valBtn = DISCONNECT_VALUE;
    } else {
      btnLabel = CONNECT_LABEL;
      classToRemove = "btn-danger";
      classToAdd =  "btn-success";
      valBtn = CONNECT_VALUE;
    }
    console.log(btnLabel, classToAdd, classToRemove);
    $('#connect').text(btnLabel);
    $('#connect').removeClass(classToRemove).addClass(classToAdd);
    $('#connect').val(valBtn);
  }

  // events
  $('.ledAction').on('click', function() {
    // Send button value
    sendAction(LED_ACTION, $(this).val());
  });

  $('#connect').on('click', function(){
    if ($(this).val() == CONNECT_VALUE){
      sendAction(CONNECT_ACTION);
    }else if ($(this).val() == DISCONNECT_VALUE){
      sendAction(CLOSE_ACTION);
    } else {
      sendAction(CONNECT_ACTION);
    }
  });

  // websockets
  ws.onmessage = function(msg) {
    var jsonMsg = JSON.parse(msg.data);
    console.log(msg.data);
    
    switch(jsonMsg.type) {
      case LED_VALUE_ACTION:
        addValueToChart(jsonMsg.value);
        break;
      case CONNECT_VALUE_ACTION:
        console.log('test ', jsonMsg);
        updateConnectBtn(jsonMsg.value);
        break;
    }
  }

  //init
  updateConnectBtn(false);
}());
