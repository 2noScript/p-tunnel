

import express from 'express'
import http from 'http'
import WebSocket ,{ WebSocketServer } from 'ws'



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
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'request',
                data: "xxx"
            }));
        }
    });

    // console.log(wss.clients)
    res.send('Ngrok-like server is running!');
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
