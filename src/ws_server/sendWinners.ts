import { WebSocket } from 'ws';
import { GameDatabase } from './common/GameDatabase';
import { showResMessage } from './common/consoleMessages';

const gameDatabase = GameDatabase.getInstance();

export function sendWinners(ws: WebSocket) {
  const winners = gameDatabase.getWinnersData();
  const response = {
    type: 'update_winners',
    data: JSON.stringify(winners),
    id: 0,
  };
  ws.send(JSON.stringify(response));
  showResMessage(response);
}
