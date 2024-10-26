import { WebSocket } from 'ws'
import net from 'net'
import { log,error } from 'console'
import { LOCAL_IP, MSG_TYPE, WS_EVENT, WSS_EVENT } from './constant.js'

export class TunnelClient {
    #TUNNEL_SERVER_URL
    constructor(tunnelServerUrl) {
        this.#TUNNEL_SERVER_URL = tunnelServerUrl
    }

    register(port) {
        const ws = new WebSocket(this.#TUNNEL_SERVER_URL)
        ws.on('open', () => {
            ws.send(
                JSON.stringify({
                    type: 'register',
                    data: {
                        port,
                    },
                })
            )

        })
        ws.on('close', () => {
            log('connection closed.')
        })

        ws.on('error', err => {
            error('server error:', err)
        })

        ws.on('message', message => {
            const msg = JSON.parse(message)

            switch (msg.type) {
                case MSG_TYPE.REGISTER:
                    console.log(msg.data)
                    break
                default:
                    break
            }
            // if (msg.type === 'request') {
            //     const localPort = 3000
            //     const client = new net.Socket()
            //     client.connect(localPort, LOCAL_IP, () => {
            //         client.write(msg.data)
            //     })
            //     client.on('data', data => {
            //         ws.send(
            //             JSON.stringify({ 
            //                 type: 'response',
            //                 data: data.toString(),
            //                 tunnelId: tunnelId,
            //             })
            //         )
            //         client.destroy()
            //     })
            // }
        })

        return ws
    }

    close(ws){
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
            // ws.close();
            console.log("WebSocket connection closed.");
        } else {
            console.log("WebSocket is not open or already closed.");
        }
    }
}

const tunnelCl = new TunnelClient('http://127.0.0.1:8080')



const w1=tunnelCl.register(4000)
const w2=tunnelCl.register(5000)

tunnelCl.close(w1)
tunnelCl.close(w2)



