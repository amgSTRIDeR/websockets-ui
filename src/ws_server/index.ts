import WebSocket from 'ws';
import handleRequest from './handleRequest';
import { showReqMessage } from './common/consoleMessages';
import { CurrentUser, GameDatabase } from './common/GameDatabase';
import { updateRooms } from './updateRooms';

const gameDatabase = GameDatabase.getInstance();

export default function startWebSocketServer(port: number) {
    const wss = new WebSocket.Server({ port });
    
    wss.on('connection', function connection(ws) {
        let currentUser: CurrentUser = { name: '', index: '' };
        gameDatabase.on('update_rooms', updateRooms.bind(null, ws));
        ws.on('message', function incoming(message) {
            const messageString = message.toString();
            const messageObject = JSON.parse(messageString);
            showReqMessage(messageObject);
            try {
               currentUser = handleRequest(messageObject, ws, currentUser) ?? currentUser;
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