import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import { getEnvironmentVariable } from "../util/env.js";
import { UserData } from "./user-database.js";
import { SessionData } from "./session-database.js";
import { SortableItemData } from "./sortable-database.js";

interface DatabaseTables {
    user: UserData,
    session: SessionData,
    sortable: SortableItemData
}

const dialect = new SqliteDialect({
    database: new SQLite(getEnvironmentVariable("DATABASE_FILE_PATH") as string)
});

const database = new Kysely<DatabaseTables>({
    dialect
});

export abstract class Database {
    db: Kysely<DatabaseTables>;

    constructor() {
        this.db = database;
        this.createTableIfNotExists();
    }

    abstract createTableIfNotExists(): void;
}
