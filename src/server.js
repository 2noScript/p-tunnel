import express from 'express'
import http from 'http'
import { WebSocketServer } from 'ws'
import { log } from 'console'
import { sendMessage, encrypt } from './utils.js'
import { LOCAL_IP, MSG_TYPE, WS_EVENT, WSS_EVENT, STATUS,DEFAULT_TUNNEL_SERVER_PORT } from './constant.js'

export class TunnelServer {
    #PORT
    #SERVER_URL
    #tunnels
    #app
    #wss
    #server
    constructor() {
        this.#tunnels = {}
        this.#app = express()
        this.#server = http.createServer(this.#app)
        this.#wss = new WebSocketServer({ server: this.#server })
        this.setPort(DEFAULT_TUNNEL_SERVER_PORT)
    }


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
                const tunnelId = `${clientIP}:${msg.data.port}`
                switch (msg.type) {
                    case MSG_TYPE.REGISTER:
                        if (this.#tunnels.hasOwnProperty(tunnelId)) {
                            ws.send(
                                JSON.stringify({
                                    type: MSG_TYPE.REGISTER,
                                    data: {
                                        tunnelId,
                                        status: STATUS.FAILURE,
                                    },
                                })
                            )
                        } else {
                            this.#tunnels[tunnelId] = ws
                            ws.send(
                                JSON.stringify({
                                    type: MSG_TYPE.REGISTER,
                                    data: {
                                        tunnelId,
                                        status: STATUS.SUCCESS,
                                    },
                                })
                            )
                            console.log(`register success on key :${tunnelId}`)
                        }
                        break
                    case MSG_TYPE.REQUEST:
                        break
                    default:
                        break
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
    
    setPort(port){
        this.#PORT=port
        this.#SERVER_URL = `http://${LOCAL_IP}:${this.#PORT}`
    }
    start() {
        this.#events()
        this.#info()
        this.#server.listen(this.#PORT, () => {
            log(this.#SERVER_URL)
        })
    }
}
