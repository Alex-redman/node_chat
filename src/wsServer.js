const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const users = new Map();

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    const userId = uuidv4();

    users.set(userId, { ws, username: null });

    ws.on('message', (message) => {
      let data;

      try {
        data = JSON.parse(message);
      } catch (e) {
        return;
      }

      if (data.type === 'set_username') {
        users.get(userId).username = data.username;
      }

      if (data.type === 'message') {
        const now = new Date().toISOString();
        const user = users.get(userId);
        const msg = {
          type: 'message',
          author: user.username || 'Anonymous',
          time: now,
          text: data.text,
        };

        for (const [, u] of users) {
          u.ws.send(JSON.stringify(msg));
        }
      }
    });

    ws.on('close', () => {
      users.delete(userId);
    });
  });
}

module.exports = { setupWebSocket };
