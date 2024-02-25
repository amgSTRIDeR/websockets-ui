import { WebSocket } from 'ws';
import { CurrentUser, GameDatabase } from './common/GameDatabase';
import { showResMessage } from './common/consoleMessages';

export function handleCreateRoomReq(
  ws: WebSocket,
  currentUser: CurrentUser
) {
  const gameDatabase = GameDatabase.getInstance();
  gameDatabase.createRoom(currentUser);

  const availableRoomsObj = gameDatabase.getAvailableRoomsRes();
  showResMessage(availableRoomsObj);
  ws.send(JSON.stringify(availableRoomsObj));
}
