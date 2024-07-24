import { SortableItemDto, SortableItemTypes } from "@sorter/api";
import { splitArrayIntoBatches } from "../util/logic.js";
import { Database } from "./database.js"

export interface SortableItemData {
    id: string;
    type: string
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

    async addSortableItems(items: SortableItemDto<any>[], type: SortableItemTypes) {
        if (items.length > 0) {
            return await this.db.replaceInto('sortable')
            .values(items.map(item => { return {
                id: item.id,
                type: type,
                data: JSON.stringify(item.data)
            }}))
            .returningAll()
            .execute()
        }
        else {
            return [];
        }        
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
        let items = [];
        // Split into batches so that each query is not too big.
        const idBatches = splitArrayIntoBatches(ids, 100);
        for (let i = 0; i < idBatches.length; i++) {
            const batch = await this.db.selectFrom('sortable')
                .selectAll()
                .where(eb => eb.or(idBatches[i].map(id => {
                    return eb.and([
                        eb('id', '=', id),
                        eb('type', '=', type)
                    ])
                })))
                .execute();
            items.push(batch);
        }
        return items.flat();
    }

    async getAllSortableItems(type: string) {
        return await this.db.selectFrom('sortable')
            .selectAll()
            .where('type', '=', type)
            .execute();
    }

    async deleteSortableItem(id: string, type: string) {
        return await this.db.deleteFrom('sortable')
            .where(eb => eb.and([
                eb('id', '=', id),
                eb('type', '=', type)
            ]))
            .execute();
    }
}
