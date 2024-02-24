import crypto from 'crypto';
import { RegRequestData } from './interfaces';

export interface User {
    index: number | string;
    name: string;
    password: string;
}

export interface Winner {
    name: string;
    wins: number;
}

export class UsersDatabase {
    private static instance: UsersDatabase | null = null;
    private users: User[] = [];
    private winners: Winner[] = [{ name: 'test', wins: 0}];

    private constructor() {}

    static getInstance() {
        if (this.instance === null) {
            this.instance = new UsersDatabase();
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
}