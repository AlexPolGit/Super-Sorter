import { Database } from "./database.js"
import { SortableItemDto } from '@sorter/api/src/objects/sortable.js';

export interface SortableItemData {
    id: string;
    type: string;
    data: string;
}

export class SortableItemDatabase extends Database {

    constructor() {
        super();
    }

    override async createTableIfNotExists() {
        await this.db.schema.createTable("sortable").ifNotExists()
            .addColumn("id", "varchar(256)", (cb) => cb.notNull())
            .addColumn("type", "varchar(64)", (cb) => cb.notNull())
            .addColumn("data", "json", (cb) => cb.defaultTo("{}"))
            .addPrimaryKeyConstraint("primary_key", ["id", "type"])
            .execute();
    }

    async createSortableItem(item: SortableItemDto) {
        return await this.db.replaceInto('sortable')
            .values({
                id: item.id,
                type: item.type.toString(),
                data: JSON.stringify(item.data)
            })
            .returningAll()
            .executeTakeFirstOrThrow()
    }
    
    async findSortableItem(id: string, type: string) {
        return await this.db.selectFrom('sortable')
            .where(eb => eb.and([
                eb('id', '=', id),
                eb('type', '=', type)
            ]))
            .selectAll()
            .executeTakeFirst()
    }
    
    async findSortableItems(ids: string[], type: string) {
        return await this.db.selectFrom('sortable')
            .selectAll()
            .where(eb => eb.or(ids.map(id => {
                return eb.and([
                    eb('id', '=', id),
                    eb('type', '=', type)
                ])
            })))
            .execute();
    }
}
