import { WebSocket } from 'ws'
import net from 'net'
import { log,error } from 'console'
import { LOCAL_IP, MSG_TYPE, WS_EVENT, WSS_EVENT } from './constant.js'
import axios from 'axios'
import { type } from 'os'

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
                    break
                case MSG_TYPE.REQUEST:

                    const req=msg.data
                    const axiosRequest=axios({
                        method:req.method,
                        url:`http://${LOCAL_IP}:${port}`,
                        params:req.query,
                        body:req.body,
                        headers: {
                            ...req.headers,
                            host: LOCAL_IP, 
                        },
                    })
                    axiosRequest.then(res=>{
                        console.log("x",res.data)
                        ws.send(JSON.stringify({
                            type:MSG_TYPE.REQUEST,
                            data:'are ok'
                        }))
                    }).catch(err=>{
                        console.log(err)
                    })
                    break
                default:
                    break
            }
         
           
        })
        return ws
    }

    close(ws){
        if (ws.readyState === WebSocket.OPEN) {
            ws.onopen = () => {
                ws.close();
                console.log("WebSocket connection closed.");
            };
        } else {
            console.log("WebSocket is not open or already closed.");
        }
    }
}

const tunnelCl = new TunnelClient('http://127.0.0.1:8080')

const w1=tunnelCl.register(3000)





