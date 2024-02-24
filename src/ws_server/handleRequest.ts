import { WebSocket } from "ws";
import { Message, RegRequestData } from "./common/interfaces";
import { handleReqRequest } from "./handleReqRequest";

export default function handleRequest(message: Message, ws: WebSocket) {
  const messageData = JSON.parse(message.data) as RegRequestData;
  switch (message.type) {
    case 'reg':
      handleReqRequest(messageData, ws);
      break;
  }
}
