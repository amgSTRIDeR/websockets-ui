import crypto from 'crypto';
import { RegRequestData } from './interfaces';
import { showInfoMessage } from './consoleMessages';
import { EventEmitter } from 'stream';

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
    roomId: number | string,
    roomUsers: CurrentUser[],
}

export class GameDatabase extends EventEmitter {
    private static instance: GameDatabase | null = null;
    private users: User[] = [];
    private winners: Winner[] = [{ name: 'test', wins: 0}];
    private rooms: Room[] = [];
    private constructor() {
        super();
    }

    static getInstance() {
        if (this.instance === null) {
            this.instance = new GameDatabase();
        }
        return this.instance;
    }

    addUser(userData: RegRequestData) {
        const index = crypto.randomBytes(16).toString('hex');
        const userInDatabase = Object.assign({ index }, userData);
        this.users.push(userInDatabase);
        return userInDatabase;
    }

    findUserInDatabase(name: string) {
        const userInDatabase = this.users.find(user => user.name === name);
        if(userInDatabase) {
            return userInDatabase;
        } else {
            return false;
        }
    }

    checkUser(userData: RegRequestData) {
        const userInDatabase = this.findUserInDatabase(userData.name);
        if(userInDatabase) {
            if(userInDatabase.password === userData.password) {
                return userInDatabase;
            } else {
                return false;
            }
        } else {
            return this.addUser(userData);
        }
    }

    addWinners(name: string) {
        const winner = this.winners.find(winner => winner.name === name);
        if(winner) {
            winner.wins++;
        } else {
            this.winners.push({ name, wins: 1 });
        }
    }

    getWinners() {
        return this.winners;
    }

    createRoom(user: CurrentUser) {
        if(this.rooms.some(room => room.roomUsers.some(roomUser => roomUser.name === user.name))) {
            showInfoMessage('User already in room');
            return;
        }
        const roomId = crypto.randomBytes(16).toString('hex');
        const room = {
            roomId,
            roomUsers: [user],
        }
        this.rooms.push(room);
        this.emit('update_rooms');
    }

    getAvailableRoomsRes() {
        const availableRooms = this.rooms.filter(room => room.roomUsers.length === 1);
        const response = {
            type: 'update_room',
            data: JSON.stringify(availableRooms),
            id: 0,
        }
        return response;
    }
}