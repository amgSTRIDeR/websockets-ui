import { WebSocket } from 'ws';
import { CurrentUser, GameDatabase } from './common/GameDatabase';
import { updateRooms } from './updateRooms';

const gameDatabase = GameDatabase.getInstance();

export function handleCreateRoomReq(
  ws: WebSocket,
  currentUser: CurrentUser
) {
  gameDatabase.createRoom(currentUser);
}
