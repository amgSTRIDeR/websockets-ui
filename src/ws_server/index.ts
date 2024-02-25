import WebSocket from 'ws';
import handleRequest from './handleRequest';
import { showReqMessage } from './common/consoleMessages';
import { GameDatabase } from './common/GameDatabase';
import { updateRooms } from './updateRooms';
import { EventEmitter } from 'stream';

const gameDatabase = GameDatabase.getInstance();

class Player extends EventEmitter {
    constructor(public name: string, public password: string, public index: string | number) {
        super();
    }

    sendCreateRoomResponse() {

    }
}

export default function startWebSocketServer(port: number) {
    const wss = new WebSocket.Server({ port });
    
    wss.on('connection', function connection(ws) {
        const player = new Player('', '', '');
        gameDatabase.on('update_rooms', updateRooms.bind(null, ws));
        ws.on('message', function incoming(message) {
            const messageString = message.toString();
            const messageObject = JSON.parse(messageString);
            showReqMessage(messageObject);
            try {
               handleRequest(messageObject, ws, player);
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