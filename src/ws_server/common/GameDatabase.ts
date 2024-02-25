import crypto from 'crypto';
import { Player, RegRequestData } from './interfaces';
import { showInfoMessage } from './consoleMessages';
import { EventEmitter } from 'stream';
import { WebSocket } from 'ws';

export interface CurrentUser {
  name: string;
  index: number | string;
}

export interface User extends CurrentUser {
  password: string;
}

export interface Winner {
  name: string;
  wins: number;
}

export interface Room {
  roomId: number | string;
  roomUsers: Player[];
}

export class GameDatabase extends EventEmitter {
  private static instance: GameDatabase | null = null;
  private users: Player[] = [];
  private winners: Winner[] = [{ name: 'test', wins: 0 }];
  private rooms: Room[] = [];
  private games: any[] = [];
  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance === null) {
      this.instance = new GameDatabase();
    }
    return this.instance;
  }

  addUser(player: Player) {
    console.log('addUser', player)
    const index = crypto.randomBytes(16).toString('hex');
    player.index = index;

    this.users.push(player);
  }

  findUserInDatabase(name: string) {
    const userInDatabase = this.users.find((user) => user.name === name);
    if (userInDatabase) {
      return userInDatabase;
    } else {
      return false;
    }
  }

  checkUser(userData: RegRequestData, player: Player) {
    const userInDatabase = this.findUserInDatabase(userData.name);
    if (userInDatabase) {
      if (userInDatabase.password === userData.password) {
        return userInDatabase;
      } else {
        return false;
      }
    } else {
      player.name = userData.name;
      player.password = userData.password;
      this.addUser(player);
      return player;
    }
  }

  addWinners(name: string) {
    const winner = this.winners.find((winner) => winner.name === name);
    if (winner) {
      winner.wins++;
    } else {
      this.winners.push({ name, wins: 1 });
    }
  }

  getWinners() {
    return this.winners;
  }

  createRoom(player: Player) {
    if (
      this.rooms.some((room) =>
        room.roomUsers.some((roomUser) => roomUser === player)
      )
    ) {
      showInfoMessage('User already in room');
      return;
    }
    const roomId = crypto.randomBytes(16).toString('hex');
    const room = {
      roomId,
      roomUsers: [player],
    };
    this.rooms.push(room);
    this.emit('update_rooms');
  }

  getAvailableRoomsRes() {
    const availableRooms = this.rooms.filter(
      (room) => room.roomUsers.length === 1
    );
    const response = {
      type: 'update_room',
      data: JSON.stringify(availableRooms),
      id: 0,
    };
    return response;
  }

  addUserToRoom(player: Player, indexRoom: number | string, ws: WebSocket) {
    const roomIndex = this.rooms.findIndex((room) => room.roomId === indexRoom);
    if (roomIndex !== -1) {
      if(this.rooms[roomIndex].roomUsers.some((roomUser) => roomUser === player)) {
        showInfoMessage('User already in room');
        return;
      }

      if (this.rooms[roomIndex].roomUsers.length < 2) {
        this.rooms[roomIndex].roomUsers.push(player);
        this.createGame(this.rooms[roomIndex]);
        this.emit('update_rooms');
      } else {
        showInfoMessage('Room is full');
      }
    } else {
      showInfoMessage('Room not found');
    }
  }

  createGame(room: Room) {
    const idGame = crypto.randomBytes(16).toString('hex');
    const idPlayer1 = crypto.randomBytes(16).toString('hex');
    const idPlayer2 = crypto.randomBytes(16).toString('hex');
    const game = {
      idGame,
      player1: {id: idPlayer1, player: room.roomUsers[0]},
      player2: {id: idPlayer2, player: room.roomUsers[1]},
    };
    this.games.push(game);

    const response1 = {
      type: 'create_game',
      data: JSON.stringify({idGame, idPlayer: game.player1.id}),
      id: 0,
    };

    const response2 = {
      type: 'create_game',
      data: JSON.stringify({idGame, idPlayer: game.player2.id}),
      id: 0,
    };

    game.player1.player.sendCreateRoomResponse(JSON.stringify(response1));
    game.player2.player.sendCreateRoomResponse(JSON.stringify(response2));
  }
}
