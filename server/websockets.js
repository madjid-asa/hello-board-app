let connects = [];

const addUsers = ws => {
  connects.push(ws);
};

const sendDataToWs = (type, value) => {
  var msg = JSON.stringify({ type, value });
  connects.forEach(socket => {
    socket.send(msg /*, callback */);
  });
};

module.exports = {addUsers, sendDataToWs};