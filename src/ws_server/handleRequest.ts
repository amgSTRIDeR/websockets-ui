import { WebSocket } from "ws";

export default function handleRequest(message: {}, ws: WebSocket) {
  ws.send(JSON.stringify({
    type: "reg",
    data:
        {
            name: "user",
            index: 1,
            error: true,
            errorText: "User is exist",
        },
    id: 0
  }));

  console.log('Sent message:', message);
}
