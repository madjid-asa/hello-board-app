const SerialPort = require('serialport');

const serialPort = new SerialPort('COM11', {
  autoOpen: false,
  baudRate: 9600
});

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


// Events
serialPort.on('error', err => {
  console.error(err); // THIS SHOULD WORK!
});

module.exports = {serialPort, openSerialPort, closeSerialPort, writeMsg}