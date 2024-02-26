import WebSocket from 'ws';
import handleRequest from './handleRequest';
import { showReqMessage, showResMessage } from './common/consoleMessages';
import { GameDatabase } from './common/GameDatabase';
import { updateRooms } from './updateRooms';
import { EventEmitter } from 'stream';

const gameDatabase = GameDatabase.getInstance();

export interface PlayerInterface {
  name: string;
  password: string;
  index: string | number;
  ws: WebSocket;
  sendResponse(response: object): void;
}

class Player extends EventEmitter {
    constructor(public name: string, public password: string, public index: string | number, public ws: WebSocket) {
        super();
    }

    sendResponse(response: object) {
        showResMessage(response);
        this.ws.send(JSON.stringify(response));
    }
}

export default function startWebSocketServer(port: number) {
    const wss = new WebSocket.Server({ port });
    
    wss.on('connection', function connection(ws) {
        const player = new Player('', '', '', ws);
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
            gameDatabase.removePlayer(player);
            gameDatabase.removeListener('update_rooms', updateRooms.bind(null, ws));
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