import { WebSocket } from 'ws'
import net from 'net'
import { log } from 'console'
import { LOCAL_IP } from './constant.js'

export class TunnelClient {
    #ws
    #key
    #isConnect
    #tunnelServerUrl
    #tunnelsClient
    constructor(tunnelServerUrl, key) {
        this.#key = key
        this.#tunnelServerUrl = tunnelServerUrl
        this.#tunnelsClient = {}

      
    }

    register( port) {
        log(this.#tunnelServerUrl)
        const ws = new WebSocket(this.#tunnelServerUrl)

        ws.on('open', () => {
            ws.send(
                JSON.stringify({
                    type: 'register',
                    port 
                })
            )
        })

        ws.on('close', () => {
            console.log('connection closed.')
        })
        ws.on('error', error => {
            console.error('server error:', error)
        })

        ws.on('message', message => {
            const msg = JSON.parse(message)
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

        // if (this.#isConnect) {
        //     this.#ws.send(
        //         JSON.stringify({
        //             type: 'register',
        //             tunnelId: `${this.#key}:${port}`,
        //         })
        //     )
        //     return
        // }
        // log("don't connect")
    }
}

const tunnelCl = new TunnelClient('http://127.0.0.1:8080', '2202200')

tunnelCl.register(4000)

tunnelCl.register(5000)