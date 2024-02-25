import { WebSocket } from 'ws';
import {
  AddUserToRoomData,
  AddUserToRoomRequestMessage,
  Message,
  RegRequestData,
} from './common/interfaces';
import { handleReqRequest } from './handleReqRequest';
import { CurrentUser, GameDatabase } from './common/GameDatabase';

const gameDatabase = GameDatabase.getInstance();

export default function handleRequest(
  message: Message,
  ws: WebSocket,
  currentUser: CurrentUser
) {
  switch (message.type) {
    case 'reg':
      return handleReqRequest(<RegRequestData>JSON.parse(message.data), ws);
    case 'create_room':
      gameDatabase.createRoom(currentUser);
      break;
    case 'add_user_to_room':
      console.log('add_user_to_room', message);
      gameDatabase.addUserToRoom(
        currentUser,
        (<AddUserToRoomData>JSON.parse(message.data)).indexRoom);
      break;
  }
}
