import { WebSocket } from 'ws';
import {
  AddShipsData,
  AddUserToRoomData,
  AttackData,
  Message,
  RandomAttackData,
  RegRequestData,
} from './common/interfaces';
import { handleReqRequest } from './handleReqRequest';
import { GameDatabase } from './common/GameDatabase';
import { PlayerInterface } from '.';

const gameDatabase = GameDatabase.getInstance();

export default function handleRequest(
  message: Message,
  ws: WebSocket,
  player: PlayerInterface
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
    case 'add_ships':
      gameDatabase.addShips(<AddShipsData>JSON.parse(message.data));
      break;
    case 'attack':
      gameDatabase.attack(<AttackData>JSON.parse(message.data));
      break;
    case 'randomAttack':
      gameDatabase.randomAttack(<RandomAttackData>JSON.parse(message.data));
      break;
  }
}
