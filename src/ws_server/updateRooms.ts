import { WebSocket } from "ws";
import { GameDatabase } from "./common/GameDatabase";
import { showResMessage } from "./common/consoleMessages";

const gameDatabase = GameDatabase.getInstance();

export function updateRooms(ws: WebSocket) {
    const availableRoomsObj = gameDatabase.getAvailableRoomsRes();
    showResMessage(availableRoomsObj);
    ws.send(JSON.stringify(availableRoomsObj));
}