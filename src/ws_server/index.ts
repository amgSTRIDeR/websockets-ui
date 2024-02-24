import WebSocket from 'ws';
import handleRequest from './handleRequest';
import { showReqMessage } from './common/consoleMessages';

export default function startWebSocketServer(port: number) {
    const wss = new WebSocket.Server({ port });

    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            const messageString = message.toString();
            const messageObject = JSON.parse(messageString);
            showReqMessage(messageObject);
            try {
                handleRequest(messageObject, ws);
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        })

        ws.on('close', function close() {
            console.log('WebSocket connection closed');
        });
    })


    process.on('SIGINT', function() {
        console.log('Shutting down WebSocket server...');
        wss.clients.forEach(function(client) {
            client.terminate();
        });
        wss.close(function() {
            console.log('WebSocket server closed');
            process.exit();
        });
    });
}