import express from 'express'
import http from 'http'
import { WebSocketServer } from 'ws'
import { LOCAL_IP, MSG_TYPE ,WS_EVENT,WSS_EVENT} from './constant.js'
import { log } from 'console'

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
    }

    #proxy() {}

    #info() {
        this.#app.get('/', (req, res) => {
            res.send('server is running!')
        })

        this.#app.get('/info', (req, res) => {
            res.json(this.#tunnels)
        })
    }
    #events() {
        this.#wss.on(WSS_EVENT.CONNECTION, (ws, req) => {
            const clientIP = req.socket.remoteAddress

            ws.on(WS_EVENT.MESSAGE, message => {
                const msg = JSON.parse(message)

                switch (msg.type) {
                }

                if (msg.type === 'register') {
                    this.#tunnels[`${clientIP}:${msg.port}`] = ws
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

            ws.on(WS_EVENT.CLOSE, () => {
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
        this.#events()
        this.#info()
        this.#server.listen(this.#port, () => {
            log(`http://${LOCAL_IP}:${this.#port}`)
        })
    }
}
