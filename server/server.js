const express     = require('express');
const app         = express();

require('./config/environment.js')(app, express);
const mySerialPort = require('./serialPort.js');
var websockets = require('./websockets.js');
const actions = require('./actions.js');

const callbacks = actions.getCallBacks(websockets.sendDataToWs);
const serialPort = mySerialPort.initSerialPort('COM11', callbacks.callbackSPReading);

app.set('port', process.env.PORT || 3000);

app.ws('/', (ws, req) => {
  websockets.addUsers(ws);

  ws.on('message', message => {
    var jsonMsg = JSON.parse(message);
    switch(jsonMsg.type) {
      case actions.LED_ACTION:
        mySerialPort.writeMsg(""+jsonMsg.value);
        break;
      case actions.CONNECT_ACTION:
        mySerialPort.openSerialPort(callbacks.callbackEvntSerialPort);
        break;
      case actions.CLOSE_ACTION:
        mySerialPort.closeSerialPort(callbacks.callbackEvntSerialPort);
        break;
      default:
        console.warn("Don't know this kind of actions : ", jsonMsg.type);
    }
  });
  
  ws.on('close', websockets.wsCallBackClose(ws));
});

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'));
});

// init
mySerialPort.openSerialPort(callbacks.callbackEvntSerialPort);