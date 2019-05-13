const express     = require('express');
const app         = express();
const expressWs   = require('express-ws')(app);
const morgan      = require('morgan');
const compression = require('compression');
const serveStatic = require('serve-static');
const basicAuth   = require('basic-auth-connect');
var SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const LED_ACTION = "led_action";
const LED_VALUE_ACTION = "led_value";
const CONNECT_VALUE_ACTION = "connect_value";
const CONNECT_ACTION = "connect_action";
const CLOSE_ACTION = "close_action";

const user = process.env.USER;
const pass = process.env.PASS;

let connects = [];
let deviceIsConnected = false;


var serialPort = new SerialPort('COM11', {
  autoOpen: false,
  baudRate: 9600
});

const parserialPortser = serialPort.pipe(new Readline({ delimiter: '\r\n' }));

serialPort.on('error', err => {
  console.error(err); // THIS SHOULD WORK!
});

const openSerialPort = () => {
  serialPort.open(err => {
    if (err) {
      console.error(err);
      deviceIsConnected = false;
    } else {
      deviceIsConnected = true;
    }
    console.log(deviceIsConnected);
    sendDataToWs(CONNECT_VALUE_ACTION, deviceIsConnected, connects);
  })
};

const closeSerialPort = () => {
  serialPort.close( err => {
    if (err) {
      console.error(err);
    } else {
      deviceIsConnected = false;
    }
    sendDataToWs(CONNECT_VALUE_ACTION, deviceIsConnected, connects);
  });
};

function sendDataToWs(type, value, connects) {
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

app.use(morgan('dev'));
app.use(compression());
app.use(serveStatic(`${__dirname}/public`));

app.ws('/', (ws, req) => {
  connects.push(ws);

  ws.on('message', message => {
    console.log('Received -', message, '-', deviceIsConnected);
    var jsonMsg = JSON.parse(message);
    switch(jsonMsg.type) {
      case LED_ACTION:
        serialPort.write(""+jsonMsg.value);
        break;
      case CONNECT_ACTION:
        openSerialPort();
        break;
      case CLOSE_ACTION:
        closeSerialPort();
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
openSerialPort();