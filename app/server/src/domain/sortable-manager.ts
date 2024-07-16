import { LRUCache } from 'lru-cache'
import { getEnvironmentVariable } from '../util/env.js';
import { SortableItemDto, SortableItemTypes } from '../../../lib/src/objects/sortable.js';import { SortableItemDatabase } from '../database/sortable-database.js';
import { SortableObjectData } from '../../../lib/src/objects/sortables/sortable.js';

export class SortableItemMananger {
    private _sortableItemDatabase: SortableItemDatabase;
    private _sortablesCache: LRUCache<string, SortableItemDto<any>>;

    constructor() {
        this._sortableItemDatabase = new SortableItemDatabase();

        const cacheSize = parseInt(getEnvironmentVariable("SORTABLE_ITEM_CACHE_SIZE", false, "10000"));
        this._sortablesCache = new LRUCache({ max: cacheSize });
    }

    async saveItemsToDb(items: SortableItemDto<any>[], type: SortableItemTypes): Promise<void> {
        await this._sortableItemDatabase.addSortableItems(items, type);
        this.storeItemsInCache(items, type);
    }

    async getItemsFromDb(ids: string[], type: SortableItemTypes): Promise<{[id: string]: SortableItemDto<SortableObjectData> | null}> {
        let loaded = new Map<string, SortableItemDto<any> | null>(ids.map(id => [id, null]));

        this.getItemsFromCache(ids, type).forEach(cachedItem => {
            // console.log(`Loaded from cache: [${type}:${cachedItem.id}]`);
            loaded.set(cachedItem.id, cachedItem);
        });

        let loadFromDb: string[] = [];
        loaded.forEach((value, key) => {
            if (value === null) {
                loadFromDb.push(key);
            }
        });

        (await this._sortableItemDatabase.findSortableItems(loadFromDb, type)).forEach(row => {
            let item: SortableItemDto<any> = {
                id: row.id,
                data: JSON.parse(row.data)
            };
            // console.log(`Loaded from DB: [${type}:${item.id}]`);
            loaded.set(item.id, item);
            this.storeItemInCache(item, type);
        });

        return Object.fromEntries(loaded.entries());
    }

    private storeItemInCache(item: SortableItemDto<any>, type: SortableItemTypes) {
        this._sortablesCache.set(`${type}~${item.id}`, item);
    }

    private storeItemsInCache(items: SortableItemDto<any>[], type: SortableItemTypes) {
        items.forEach(item => {
            this._sortablesCache.set(`${type}~${item.id}`, item);
        });
    }

    private getItemsFromCache(ids: string[], type: SortableItemTypes): SortableItemDto<any>[] {
        let cachedItems: SortableItemDto<any>[] = [];

        ids.forEach(id => {
            const item = this._sortablesCache.get(`${type}~${id}`);
            if (item) {
                cachedItems.push(item);
            }
        });

        return cachedItems;
    }
}
