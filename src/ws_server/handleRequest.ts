import { WebSocket } from 'ws';
import {
  AddUserToRoomData,
  Message,
  Player,
  RegRequestData,
} from './common/interfaces';
import { handleReqRequest } from './handleReqRequest';
import { GameDatabase } from './common/GameDatabase';

const gameDatabase = GameDatabase.getInstance();

export default function handleRequest(
  message: Message,
  ws: WebSocket,
  player: Player
) {
  switch (message.type) {
    case 'reg':
      handleReqRequest(<RegRequestData>JSON.parse(message.data), ws, player);
      break;
    case 'create_room':
      gameDatabase.createRoom(player);
      break;
    case 'add_user_to_room':
      gameDatabase.addUserToRoom(
        player,
        (<AddUserToRoomData>JSON.parse(message.data)).indexRoom, ws);
      break;
  }
}
