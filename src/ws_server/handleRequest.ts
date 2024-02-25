import { WebSocket } from "ws";
import { Message, RegRequestData } from "./common/interfaces";
import { handleReqRequest } from "./handleReqRequest";
import { CurrentUser, GameDatabase } from "./common/GameDatabase";

const gameDatabase = GameDatabase.getInstance();

export default function handleRequest(message: Message, ws: WebSocket, currentUser: CurrentUser) {
  const messageData = message.data.length ? JSON.parse(message.data) as RegRequestData : {} as RegRequestData;
  switch (message.type) {
    case 'reg':
      return handleReqRequest(messageData, ws);
    case 'create_room':
      gameDatabase.createRoom(currentUser);
      break;
  }
}
