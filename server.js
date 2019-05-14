const express     = require('express');
const app         = express();
const expressWs   = require('express-ws')(app);
const basicAuth   = require('basic-auth-connect');
const Readline = require('@serialport/parser-readline');

require('./server/config/environment.js')(app, express);
const mySerialPort = require('./server/serialPort.js');

const LED_ACTION = "led_action";
const LED_VALUE_ACTION = "led_value";
const CONNECT_VALUE_ACTION = "connect_value";
const CONNECT_ACTION = "connect_action";
const CLOSE_ACTION = "close_action";

const user = process.env.USER;
const pass = process.env.PASS;

let connects = [];
let deviceIsConnected = false;

var serialPort = mySerialPort.serialPort;

const parserialPortser = serialPort.pipe(new Readline({ delimiter: '\r\n' }));

function sendDataToWs(type, value, connects) {
  console.log(type, value, connects);
  
  var msg = JSON.stringify({ type, value });
  connects.forEach(socket => {
    socket.send(msg);
  });  
};

// Switches the port into "flowing mode"
parserialPortser.on('data', function (data) {
  // console.log('Data:', data);
  // Need to be tested
  sendDataToWs(LED_VALUE_ACTION, data, connects);
});

// Read data that is available but keep the stream from entering //"flowing mode"
parserialPortser.on('readable', function () {
  // console.log('Data:', port.read());
});

app.set('port', process.env.PORT || 3000);

if (user && pass) {
  app.use(basicAuth(user, pass));
}

const callbackEvntSerialPort = (deviceIsConnected) => {
  console.log(CONNECT_VALUE_ACTION, deviceIsConnected, connects);
  sendDataToWs(CONNECT_VALUE_ACTION, deviceIsConnected, connects);
};

app.ws('/', (ws, req) => {
  connects.push(ws);

  ws.on('message', message => {
    console.log('Received -', message, '-', deviceIsConnected);
    var jsonMsg = JSON.parse(message);
    switch(jsonMsg.type) {
      case LED_ACTION:
        mySerialPort.writeMsg(""+jsonMsg.value);
        break;
      case CONNECT_ACTION:
        mySerialPort.openSerialPort(callbackEvntSerialPort);
        break;
      case CLOSE_ACTION:
        mySerialPort.closeSerialPort(callbackEvntSerialPort);
        break;
      default:
        console.warn("Don't know this kind of actions : ", jsonMsg.type)

    }
  });
  
  ws.on('close', () => {
    connects = connects.filter(conn => {
      return (conn === ws) ? false : true;
    });
  });
});

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'));
});

// init
mySerialPort.openSerialPort(callbackEvntSerialPort);