import { v4 as uuidv4 } from 'uuid';
import { Database } from "./database.js";
import { BaseException } from '../domain/exceptions/base.js';

export class SessionNotFoundException extends BaseException {
    constructor(username: string, sessionId: string) {
        super("NOT_FOUND", `Session with ID "${sessionId}" does not exist for user "${username}".`);
    }
}

export interface SessionData {
    id: string;
    owner: string;
    name: string;
    type: string;
    items: string;
    deleted_items: string;
    history: string;
    deleted_history: string;
    algorithm: string;
    seed: number;
}

export interface NewSessionData {
    name: string;
    type: string;
    items: string;
    algorithm: string;
}

export interface UpdateSessionData {
    id: string;
    name?: string;
    items?: string;
    deleted_items?: string;
    history?: string;
    deleted_history?: string;
    algorithm?: string;
    seed?: number;
}

export enum SessionDetail {
    MIN = 0,
    SMALL = 1,
    ALL = 2
}

export class SessionDatabase extends Database {

    constructor() {
        super();
    }

    override async createTableIfNotExists() {
        await this.db.schema.createTable("session").ifNotExists()
            .addColumn("id", "varchar(36)", (cb) => cb.primaryKey().notNull())
            .addColumn("owner", "varchar(256)", (cb) => cb.notNull())
            .addColumn("name", "varchar(256)", (cb) => cb.notNull())
            .addColumn("type", "varchar(64)", (cb) => cb.notNull())
            .addColumn("items", "json", (cb) => cb.notNull().defaultTo("[]"))
            .addColumn("deleted_items", "json", (cb) => cb.notNull().defaultTo("[]"))
            .addColumn("history", "json", (cb) => cb.notNull().defaultTo("[]"))
            .addColumn("deleted_history", "json", (cb) => cb.notNull().defaultTo("[]"))
            .addColumn("algorithm", "varchar(64)", (cb) => cb.notNull())
            .addColumn("seed", "integer", (cb) => cb.notNull())
            .execute();
    }

    async createSession(username: string, newSession: NewSessionData) {
        return await this.db.replaceInto('session')
            .values({
                id: uuidv4(),
                owner: username,
                name: newSession.name,
                type: newSession.type.toString(),
                items: newSession.items,
                deleted_items: "[]",
                history: "[]",
                deleted_history: "[]",
                algorithm: newSession.algorithm,
                seed: Math.floor(Math.random() * 9999999999)
            })
            .returningAll()
            .executeTakeFirstOrThrow();
    }

    async updateSession(username: string, updateSession: UpdateSessionData) {
        return await this.db.updateTable('session')
            .set(updateSession)
            .where(eb => eb.and([eb('id', '=', updateSession.id), eb('owner', '=', username)]))
            .executeTakeFirstOrThrow();
    }
    
    async getSessionById(username: string, id: string) {
        let rows = await this.db.selectFrom('session')
            .selectAll()
            .where(eb => eb.and([eb('id', '=', id), eb('owner', '=', username)]))
            .execute();

        if (rows.length === 0) {
            throw new SessionNotFoundException(username, id);
        }

        return rows[0];
    }
    
    async getSessionsByOwner(username: string) {
        let rows = await this.db.selectFrom('session')
            .select(['session.id as sessionId', 'session.owner', 'session.name', 'session.type', 'session.algorithm', 'session.seed'])
            .where(eb => eb('owner', '=', username))
            .execute();

        return rows;
    }

    async deleteSession(username: string, id: string) {
        return await this.db
            .deleteFrom('session')
            .where(eb => eb.and([eb('id', '=', id), eb('owner', '=', username)]))
            .executeTakeFirst();
    }
}
