import { WebSocket } from 'ws';
import { GameDatabase } from './common/GameDatabase';
import { showResMessage } from './common/consoleMessages';

const gameDatabase = GameDatabase.getInstance();

export function updateRooms(ws: WebSocket) {
  const availableRoomsObj = gameDatabase.getAvailableRoomsRes();
  const stringifiedRoomsInfo = JSON.stringify(
    availableRoomsObj.data.map((room) => {
      return {
        roomId: room.roomId,
        roomUsers: room.roomUsers.map((user) => {
          return { name: user.name, index: user.index };
        }),
      };
    })
  );
  const updateRoomsMessage = {
    ...availableRoomsObj,
    data: stringifiedRoomsInfo,
  };
  showResMessage(updateRoomsMessage);
  ws.send(JSON.stringify(updateRoomsMessage));
}
