

import express from 'express'
import http from 'http'
import  { WebSocketServer } from 'ws'



const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const tunnels = {};

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const msg = JSON.parse(message);
        if (msg.type === 'register') {
            tunnels[msg.tunnelId] = ws;
            console.log(`New tunnel registered: ${msg.tunnelId}`);
            // console.log(`all tunnel`,tunnels)
        }

        if (msg.type === 'proxy') {
            if (tunnels[msg.tunnelId]) {
                tunnels[msg.tunnelId].send(JSON.stringify({
                    type: 'request',
                    data: msg.data
                }));
            }
        }
    });

    ws.on('close', () => {
        for (let tunnelId in tunnels) {
            if (tunnels[tunnelId] === ws) {
                delete tunnels[tunnelId];
                console.log(`Tunnel closed: ${tunnelId}`);
            }
        }
    });
});

app.get('/', (req, res) => {
    res.send('server is running!');
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
