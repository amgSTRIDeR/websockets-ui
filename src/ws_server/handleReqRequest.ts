import { WebSocket } from 'ws';
import { RegRequestData } from './common/interfaces';
import { GameDatabase } from './common/GameDatabase';
import { showResMessage } from './common/consoleMessages';

export function handleReqRequest(reqData: RegRequestData, ws: WebSocket) {
  const userDatabase = GameDatabase.getInstance();
  const userInDatabase = userDatabase.checkUser(reqData);
  let data: {
    name: string;
    index: number | string;
    error: boolean;
    errorText: string;
  };
  if (userInDatabase) {
    data = {
      name: userInDatabase.name,
      index: userInDatabase.index,
      error: false,
      errorText: '',
    };
  } else {
    data = {
      name: '',
      index: '',
      error: true,
      errorText: 'Password is incorrect',
    };
  }

  const reqResponseObject = {
    type: 'reg',
    data: JSON.stringify(data),
    id: 0
  }
  
  const regResponseMessage = JSON.stringify(reqResponseObject);


  ws.send(regResponseMessage);

  const winnersString = JSON.stringify(userDatabase.getWinners());
  const winnersResponseObject = {
    type: 'update_winners',
    data: winnersString,
    id: 0
  }
  const winnersRes = JSON.stringify(winnersResponseObject)
  showResMessage(winnersResponseObject)
  ws.send(winnersRes)

  showResMessage(reqResponseObject)
}
