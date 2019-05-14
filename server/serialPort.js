const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

var serialPort;

const initSerialPort = (port, callbackReading) => {
    serialPort= new SerialPort(port, {
    autoOpen: false,
    baudRate: 9600
  });

  // parser
  const parserialPortser = serialPort.pipe(new Readline({ delimiter: '\r\n' }));
  parserialPortser.on('data', callbackReading);

  return serialPort;
}

let deviceIsConnected = false;

const openSerialPort = callback => {
  serialPort.open(err => {
    if (err) {
      console.error(err);
      deviceIsConnected = false;
    } else {
      deviceIsConnected = true;
    }
    callback(deviceIsConnected);
  })
};

const closeSerialPort = callback => {
  serialPort.close( err => {
    if (err) {
      console.error(err);
    } else {
      deviceIsConnected = false;
    }
    callback(deviceIsConnected);
  });
};

const writeMsg = msg => {
  serialPort.write(msg);  
}


module.exports = {initSerialPort, openSerialPort, closeSerialPort, writeMsg}