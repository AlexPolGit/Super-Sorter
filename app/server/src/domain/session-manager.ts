import { NewSessionData, SessionDatabase, SessionDetail } from "../database/session-database.js";
import type { SortableItemTypes } from '@sorter/api/src/objects/sortables.js';
import type { MinSession, SimpleSession, FullSession, UserChoice } from '@sorter/api/src/objects/session.js';
import { Session } from "./objects/session.js";
import { Comparison } from "./objects/comparison.js";
import { SortableItem } from "./objects/sortable.js";

export function mapRowToSession(row: any, detail: SessionDetail = SessionDetail.MIN): MinSession | SimpleSession | FullSession {
    if (detail === SessionDetail.MIN) {
        return {
            id: row.id
        };
    }
    else if (detail === SessionDetail.SMALL) {
        return {
            id: row.id,
            owner: row.owner,
            name: row.name,
            type: row.type as SortableItemTypes,
            algorithm: row.algorithm,
            seed: row.seed
        };
    }
    else {
        return {
            id: row.id,
            owner: row.owner,
            name: row.name,
            type: row.type as SortableItemTypes,
            items: JSON.parse(row.items),
            deleted_items: JSON.parse(row.deleted_items),
            history: JSON.parse(row.history),
            deleted_history: JSON.parse(row.deleted_history),
            algorithm: row.algorithm,
            seed: row.seed
        };
    }
}

export class SessionManager {
    private sessionDatabase: SessionDatabase;
    private sessionCache: any;

    constructor() {
        this.sessionDatabase = new SessionDatabase();
        this.sessionCache = {};
    }

    async getSessionsForUser(username: string): Promise<SimpleSession[]> {
        return await this.sessionDatabase.getSessionsByOwner(username) as SimpleSession[];
    }

    async createSession(username: string, newSession: NewSessionData) {
        let sessionData = await this.sessionDatabase.createSession(username, newSession);
        let session = Session.fromDatabase(sessionData);
        await this.saveSession(username, session, true);
        return session.runIteration();
    }

    async deleteSession(username: string, sessionId: string) {
        await this.sessionDatabase.deleteSession(username, sessionId);
        return this.getSessionsForUser(username);
    }

    async getSessionById(username: string, id: string): Promise<Session> {
        let sessionData = await this.sessionDatabase.getSessionById(username, id);
        return Session.fromDatabase(sessionData);
    };

    async getSessionData(username: string, sessionId: string) {
        let session = await this.getSessionById(username, sessionId);
        return session.fullState();
    }

    async restartSession(username: string, sessionId: string) {
        let session = await this.getSessionById(username, sessionId);
        let result = session.restart();
        await this.saveSession(username, session);
        return result;
    }

    async undo(username: string, sessionId: string, userChoice: UserChoice) {
        let session = await this.getSessionById(username, sessionId);
        let result = session.undo(Comparison.fromUserChoice(userChoice) as Comparison);
        await this.saveSession(username, session);
        return result;
    }

    async deleteItem(username: string, sessionId: string, toDelete: string) {
        let session = await this.getSessionById(username, sessionId);
        let result = session.delete(toDelete);
        await this.saveSession(username, session);
        return result;
    }

    async undoDeleteItem(username: string, sessionId: string, toUndelete: string) {
        let session = await this.getSessionById(username, sessionId);
        let result = session.undoDelete(toUndelete);
        await this.saveSession(username, session);
        return result;
    }

    async runIteration(username: string, sessionId: string, userChoice: UserChoice | null = null) {
        let session = await this.getSessionById(username, sessionId);
        let result = session.runIteration(Comparison.fromUserChoice(userChoice));
        await this.saveSession(username, session);
        return result;
    }

    async saveSession(username: string, session: Session, create: boolean = false) {
        if (create) {
            await this.sessionDatabase.createSession(username, {
                name: session.name,
                type: session.type,
                items: JSON.stringify(session.items.map(item => item.getIdentifier())),
                algorithm: session.algorithm
            });
        }
        else {
            await this.sessionDatabase.updateSession(username, session.currentState());
        }
    }
}
