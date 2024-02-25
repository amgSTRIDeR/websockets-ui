import { WebSocket } from "ws";

export interface Message {
  type: string;
  data: any;
  id: 0;
}

export interface RegRequestData {
  name: string;
  password: string;
}

export interface RegResponseMessage extends Message {
  type: 'reg';
  data: {
    name: string;
    index: number | string;
    error: boolean;
    errorText: string;
  };
}

export interface UpdateWinnersResponseMessage extends Message {
  type: 'update_winners';
  data: [
    {
      name: string;
      wins: number;
    }
  ];
}

export interface CreateRoomRequestMessage extends Message {
  type: 'create_room';
  data: '';
}

export interface AddUserToRoomData {
  indexRoom: number | string;
}

export interface AddUserToRoomRequestMessage extends Message {
  type: 'add_user_to_room';
  data: AddUserToRoomData;
}

export interface CreateGameResponseMessage extends Message {
  type: 'create_game'; //send for both players in the room
  data: {
    idGame: number | string;
    idPlayer: number | string;
  };
}

export interface UpdateRoomStateResponseMessage extends Message {
  type: 'update_room';
  data: [
    {
      roomId: number | string;
      roomUsers: [
        {
          name: string;
          index: number | string;
        }
      ];
    }
  ];
}
export interface AddShipsData {
  gameId: number | string;
  ships: [
    {
      position: {
        x: number;
        y: number;
      };
      direction: boolean;
      length: number;
      type: 'small' | 'medium' | 'large' | 'huge';
    }
  ];
  indexPlayer:
    | number
    | string /* id of the player in the current game session */;
}

export interface AddShipsRequestMessage extends Message {
  type: 'add_ships';
  data: AddShipsData;
}

export interface StartGameResponseMessage extends Message {
  type: 'start_game';
  data: {
    ships: /* player's ships, not enemy's */
    [
      {
        position: {
          x: number;
          y: number;
        };
        direction: boolean;
        length: number;
        type: 'small' | 'medium' | 'large' | 'huge';
      }
    ];
    currentPlayerIndex: number | string;
  };
}

export interface AttackRequestMessage extends Message {
  type: 'attack';
  data: {
    gameId: number | string;
    position: {
      x: number;
      y: number;
    };
    indexPlayer:
      | number
      | string /* id of the player in the current game session */;
  };
}

export interface AttackResponseMessage extends Message {
  type: 'attack';
  data: {
    position: {
      x: number;
      y: number;
    };
    currentPlayer:
      | number
      | string /* id of the player in the current game session */;
    status: 'miss' | 'killed' | 'shot';
  };
}

export interface RandomAttackRequestMessage extends Message {
  type: 'randomAttack';
  data: {
    gameId: number | string;
    indexPlayer:
      | number
      | string /* id of the player in the current game session */;
  };
}

export interface PlayersTurnInfoResponseMessage extends Message {
  type: 'turn';
  data: {
    currentPlayer:
      | number
      | string /* id of the player in the current game session */;
  };
}

export interface FinishGameResponseMessage extends Message {
  type: 'finish';
  data: {
    winPlayer:
      | number
      | string /* id of the player in the current game session */;
  };
}


