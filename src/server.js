import express from 'express'
import http from 'http'
import { WebSocketServer } from 'ws'

export class TunnelServer {
    #port
    #tunnels
    #app
    #wss
    #server
    constructor(port) {
        this.#tunnels = {}
        this.#app = express()
        this.#server = http.createServer(this.#app)
        this.#wss = new WebSocketServer({ server: this.#server })
        this.#port = port
        
       this.#wss.on('connection', ws => {
            ws.on('message', message => {
                const msg = JSON.parse(message)
                if (msg.type === 'register') {
                    this.#tunnels[msg.tunnelId] = ws
                }
        
                if (msg.type === 'proxy') {
                    if (this.#tunnels[msg.tunnelId]) {
                        this.#tunnels[msg.tunnelId].send(
                            JSON.stringify({
                                type: 'request',
                                data: msg.data,
                            })
                        )
                    }
                }
            })

            ws.on('close', () => {
                for (let tunnelId in this.#tunnels) {
                    if (this.#tunnels[tunnelId] === ws) {
                        delete this.#tunnels[tunnelId]
                        console.log(`Tunnel closed: ${tunnelId}`)
                    }
                }
            })

        })  
    }
    
   

    start() {
        this.#app.get('/', (req, res) => {
            res.send('server is running!')
        })
        this.#server.listen(this.#port, () => {
            console.log('`Server is listening on port ${port}`')
        })
    }
}
