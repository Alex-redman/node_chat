/* eslint-disable no-console */
'use strict';

const express = require('express');
const http = require('http');
const { setupWebSocket } = require('./wsServer');

const app = express();
const server = http.createServer(app);

setupWebSocket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
