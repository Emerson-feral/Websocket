const WebSocket = require("ws");

function verifyClient(info, callback) {
  const token = info.req.url.split("token=")[1];

  if (token === "123") {
    return callback(true);
  }

  return callback(false);
}

function broadcast(jsonObject) {
  if (!this.clients) return;
  this.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(jsonObject));
    }
  });
}

function onError(ws, err) {
  console.error(`onError: ${err.message}`);
}

function onMessage(ws, data) {
  console.log(`onMessage: ${data}`);
}

function onConnection(ws, req) {
  ws.on("message", (data) => onMessage(ws, data));
  ws.on("error", (error) => onError(ws, error));
  console.log(`onConnection`);
}

module.exports = (server) => {
  const wss = new WebSocket.Server({
    server,
    verifyClient,
  });

  wss.on("connection", onConnection);
  wss.broadcast = broadcast;

  console.log(`Web Socket server is running`);

  return wss;
};
