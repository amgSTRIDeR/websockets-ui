import { WebSocket } from 'ws';
import { Message, RegRequestData } from './common/interfaces';
import { UsersDatabase } from './common/UsersDatabase';

export function handleReqRequest(reqData: RegRequestData, ws: WebSocket) {
  const userDatabase = UsersDatabase.getInstance();
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
  const regResponseMessage = JSON.stringify({
    type: 'reg',
    data: JSON.stringify(data),
  });

  ws.send(regResponseMessage);

  const winnersString = JSON.stringify(userDatabase.getWinners());
  const winnersRes = JSON.stringify({
    type: 'update_winners',
    data: winnersString,
  })
  ws.send(winnersRes)

  console.log('Sent message:', regResponseMessage);
}
