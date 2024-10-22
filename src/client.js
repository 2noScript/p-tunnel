import { WebSocket } from 'ws'
import net from 'net'
import { log } from 'console'

const serverUrl = 'ws://localhost:8080'
const tunnelId = '22022000'

const ws = new WebSocket(serverUrl)

ws.on('open', () => {
    console.log('Connected to server')
    ws.send(
        JSON.stringify({
            type: 'register',
            tunnelId: tunnelId,
        })
    )
})

ws.on('message', message => {
    const msg = JSON.parse(message)
    console.log(msg)
    if (msg.type === 'request') {
        const localPort = 3000
        const client = new net.Socket()
        client.connect(localPort, '127.0.0.1', () => {
            client.write(msg.data)
        })
        client.on('data', data => {
            ws.send(
                JSON.stringify({
                    type: 'response',
                    data: data.toString(),
                    tunnelId: tunnelId,
                })
            )
            client.destroy()
        })
    }
})

export class TunnelClient {
    #ws
    #key
    #isConnect
    constructor(tunnelServerUrl, key) {
        this.#key = key
        this.#ws = new WebSocket(tunnelServerUrl)
        this.#ws.on('connecting', () => {
            console.log('Attempting to connect...')
        })
        this.#ws.on('open', () => {

            this.#isConnect = true
        })
        this.#ws.on('close', () => {
            console.log('connection closed.')
            this.#isConnect = false
        })
        this.#ws.on('error', error => {
            console.error('server error:', error)
        })
    }
    
    register(port) {
        if (this.#isConnect) {
            this.#ws.send(
                JSON.stringify({
                    type: 'register',
                    tunnelId: `${this.#key}:${port}`,
                })
            )
            return
        }
        log("don't connect")
    }
}
