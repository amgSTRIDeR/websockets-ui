import { WebSocket } from "ws";
import { Message, RegRequestData } from "./common/interfaces";
import { handleReqRequest } from "./handleReqRequest";

export default function handleRequest(message: Message, ws: WebSocket) {
  const messageData = JSON.parse(message.data) as RegRequestData;
  let currentUser: { name: string; index: number | string } | undefined;
  switch (message.type) {
    case 'reg':
      currentUser = handleReqRequest(messageData, ws);
      break;
  }
}
