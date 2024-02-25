import { WebSocket } from 'ws';
import {
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
      // gameDatabase.addUserToRoom(
      //   currentUser,
      //   <AddUserToRoomRequestMessage>message.data.indexRoom
      // );
      break;
  }
}
