const LED_VALUE_ACTION = "led_value";
const CONNECT_VALUE_ACTION = "connect_value";
const LED_ACTION = "led_action";
const CONNECT_ACTION = "connect_action";
const CLOSE_ACTION = "close_action";
var models  = require('./models');

const getCallBacks = (callback) => {
    const callbackAction = (action, data) => {
        callback(action, data);
        models.LogBoard.create({
            data: `${action} : ${data}`
        }).then(function() {
          console.log(`${action} : ${data} ok`);
        });
    };
    // const callbackActionWS = callbackAction(websockets.sendDataToWs);
    
    const callbackSPReading = data => {
        callbackAction(LED_VALUE_ACTION, data);
    };
    
    const callbackEvntSerialPort = (deviceIsConnected) => {
        callbackAction(CONNECT_VALUE_ACTION, deviceIsConnected);
    };

    return {callbackSPReading, callbackEvntSerialPort}
}

module.exports = {
    // constants
    LED_VALUE_ACTION,
    CONNECT_VALUE_ACTION,
    LED_ACTION,
    CONNECT_ACTION,
    CLOSE_ACTION,

    // functions
    getCallBacks
}