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

const wsCallBackClose = (ws)=> () => {
  connects = connects.filter(conn => {
    return (conn === ws) ? false : true;
  });
}

module.exports = {addUsers, sendDataToWs, wsCallBackClose};