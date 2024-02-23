import WebSocket from 'ws';

export default function startWebSocketServer(port: number) {
    const wss = new WebSocket.Server({ port });

    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            console.log('received: ', message);
        })
    })
}