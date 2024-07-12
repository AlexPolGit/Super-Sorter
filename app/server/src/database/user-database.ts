import { BaseException } from "../domain/exceptions/base.js";
import { Database } from "./database.js";

export class UserNotFoundException extends BaseException {
    constructor(username: string) {
        super("NOT_FOUND", `User with username "${username}" does not exist.`);
    }
}

export interface UserData {
    username: string;
    password: string;
    admin: number;
    google: number;
}

interface NewUser extends UserData {}

interface UpdateUser {
    username: string;
    password?: string;
    admin?: number;
    google?: number;
}

export class UserDatabase extends Database {

    override async createTableIfNotExists() {
        await this.db.schema.createTable("user").ifNotExists()
            .addColumn("username", "varchar(256)", (cb) => cb.primaryKey().notNull())
            .addColumn("password", "varchar(256)", (cb) => cb.notNull())
            .addColumn("admin", "boolean", (cb) => cb.notNull())
            .addColumn("google", "boolean", (cb) => cb.notNull())
            .execute();
    }

    async createUser(newUser: NewUser) {
        return await this.db.replaceInto('user')
            .values(newUser)
            .returningAll()
            .executeTakeFirstOrThrow();
    }

    async updateUser(updateUser: UpdateUser) {
        return await this.db.updateTable('user')
            .set(updateUser)
            .returningAll()
            .executeTakeFirstOrThrow();
    }
    
    async findUserByUsername(username: string) {
        let rows = await this.db.selectFrom('user')
            .selectAll()
            .where(eb => eb('username', '=', username))
            .execute();

        if (rows.length === 0) {
            throw new UserNotFoundException(username);
        }

        return rows[0];
    }
}
