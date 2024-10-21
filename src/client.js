import WebSocket from 'ws'
import net from 'net'

const serverUrl = 'ws://localhost:8080';
const tunnelId = '22022000';

const ws = new WebSocket(serverUrl);

ws.on('open', () => {
    console.log('Connected to server');
    
    ws.send(JSON.stringify({
        type: 'register',
        tunnelId: tunnelId
    }));
});

ws.on('message', (message) => {
    const msg = JSON.parse(message);
    console.log(msg)
    if (msg.type === 'request') {
       
        const localPort = 3000; 
        const client = new net.Socket();
        client.connect(localPort, '127.0.0.1', () => {
            client.write(msg.data);
        });

        client.on('data', (data) => {
            ws.send(JSON.stringify({
                type: 'response',
                data: data.toString(),
                tunnelId: tunnelId
            }));
            client.destroy();
        });
    }
});
