import { FullSessionDto, MinSessionDto, NewSessionDto, SimpleSessionDto, UserChoice } from '@sorter/api';
import { shuffleArray } from "../util/logic.js";
import { SessionDatabase } from "../database/session-database.js";
import { Session } from "./objects/session.js";
import { Comparison } from "./objects/comparison.js";

export class SessionManager {
    private sessionDatabase: SessionDatabase;

    constructor() {
        this.sessionDatabase = new SessionDatabase();
    }

    async getSessionsForUser(username: string): Promise<SimpleSessionDto[]> {
        return await this.sessionDatabase.getSessionsByOwner(username) as SimpleSessionDto[];
    }

    async createSession(username: string, newSession: NewSessionDto): Promise<MinSessionDto> {
        let sessionData = await this.sessionDatabase.createSession(username, {
            name: newSession.name,
            type: newSession.type,
            items: JSON.stringify(newSession.items),
            algorithm: newSession.algorithm
        });

        let session = Session.fromDatabase(sessionData);

        if (newSession.shuffle) {
            shuffleArray(session.items);
        }

        await this.saveSession(username, session);
        
        return {
            sessionId: session.id
        };
    }

    async deleteSession(username: string, sessionId: string): Promise<SimpleSessionDto[]> {
        await this.sessionDatabase.deleteSession(username, sessionId);
        return this.getSessionsForUser(username);
    }

    async getSessionData(username: string, sessionId: string): Promise<FullSessionDto> {
        let session = await this.getSessionById(username, sessionId);
        return session.getFullData();
    }

    async restartSession(username: string, sessionId: string): Promise<FullSessionDto> {
        let session = await this.getSessionById(username, sessionId);
        let result = session.restart();
        await this.saveSession(username, session);
        return result;
    }

    async undo(username: string, sessionId: string, userChoice: UserChoice): Promise<FullSessionDto> {
        let session = await this.getSessionById(username, sessionId);
        let result = session.undo(Comparison.fromUserChoice(userChoice) as Comparison);
        await this.saveSession(username, session);
        return result;
    }

    async deleteItem(username: string, sessionId: string, toDelete: string): Promise<FullSessionDto> {
        let session = await this.getSessionById(username, sessionId);
        let result = session.delete(toDelete);
        await this.saveSession(username, session);
        return result;
    }

    async undoDeleteItem(username: string, sessionId: string, toUndelete: string): Promise<FullSessionDto> {
        let session = await this.getSessionById(username, sessionId);
        let result = session.undoDelete(toUndelete);
        await this.saveSession(username, session);
        return result;
    }

    async runIteration(username: string, sessionId: string, userChoice: UserChoice | null = null): Promise<MinSessionDto> {
        let session = await this.getSessionById(username, sessionId);
        let result = session.runIteration(Comparison.fromUserChoice(userChoice));
        await this.saveSession(username, session);
        return result;
    }

    private async saveSession(username: string, session: Session) {
        await this.sessionDatabase.updateSession(username, session.getCurrentState());
    }

    private async getSessionById(username: string, id: string): Promise<Session> {
        let sessionData = await this.sessionDatabase.getSessionById(username, id);
        return Session.fromDatabase(sessionData);
    };
}
