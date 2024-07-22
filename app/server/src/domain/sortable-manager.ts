import { LRUCache } from 'lru-cache'
import { SortableItemDto, SortableItemTypes, SortableObjectData } from '@sorter/api';
import { getEnvironmentVariable } from '../util/env.js';
import { SortableItemDatabase } from '../database/sortable-database.js';

export class SortableItemMananger {
    private _sortableItemDatabase: SortableItemDatabase;
    private _sortablesCache: LRUCache<string, SortableItemDto<any>>;

    constructor() {
        this._sortableItemDatabase = new SortableItemDatabase();

        const cacheSize = parseInt(getEnvironmentVariable("SORTABLE_ITEM_CACHE_SIZE", false, "100000"));
        this._sortablesCache = new LRUCache({ max: cacheSize });
    }

    /**
     * Save a list of sortable items to the database.
     * 
     * This will also cache the items in memory for later use.
     *
     * @param items - List of sortable items.
     * @param type - Type of sortable item to store.
     * @param cacheFilter - Lambda function used for filtering source items before they are cached. This should be used for removing any data that is request-specific (ex: data for a particular user) and keeping globally valid data. By default this filter will do nothing.
     */
    async saveItemsToDb<DataType extends SortableObjectData>(
        items: SortableItemDto<DataType>[],
        type: SortableItemTypes,
        cacheFilter: (items: SortableItemDto<DataType>[]) => SortableItemDto<DataType>[] = ((items) => items)
    ): Promise<void> {
        await this._sortableItemDatabase.addSortableItems(items, type);
        this.storeItemsInCache(cacheFilter(items), type);
    }

    /**
     * Gets list of sortable items from source.
     * 
     * This will also cache the items in memory for later use.
     *
     * @param type - Type of sortable item to get.
     * @param loader - Asyncronous lambda function that contains logic for getting items from source.
     * @param cacheFilter - Lambda function used for filtering source items before they are cached. This should be used for removing any data that is request-specific (ex: data for a particular user) and keeping globally valid data. By default this filter will do nothing.
     * @returns List of sortable objects from source.
     */
    async getItemsFromSource<DataType extends SortableObjectData>(
        type: SortableItemTypes,
        loader: () => Promise<SortableItemDto<DataType>[]>,
        cacheFilter: (items: SortableItemDto<DataType>[]) => SortableItemDto<DataType>[] = ((items) => items)
    ): Promise<SortableItemDto<SortableObjectData>[]> {

        let loaded: SortableItemDto<any>[] = [];

        let items = await loader();
        items.forEach(fromSourceItem => {
            let item: SortableItemDto<DataType> = {
                id: fromSourceItem.id,
                data: fromSourceItem.data
            };
            console.log(`Loaded from source: [${type}:${item.id}]`);
            loaded.push(item);
        });

        const toCache = cacheFilter(JSON.parse(JSON.stringify(items)));
        toCache.forEach(item => {
            this.storeItemInCache(item, type);
        });

        return loaded;
    }

    /**
     * Gets list of sortable items from source, or from cache if they exist there.
     * 
     * This will also cache items from the source in memory for later use.
     *
     * @param ids - List of item IDs to get its for.
     * @param type - Type of sortable item to get.
     * @param loader - Asyncronous lambda function that contains logic for getting items from source.
     * @param cacheFilter - Lambda function used for filtering source items before they are cached. This should be used for removing any data that is request-specific (ex: data for a particular user) and keeping globally valid data. By default this filter will do nothing.
     * @returns Map of sortable item IDs to items. Null value means the item could not be found in either the cache or the source.
     */
    async getItemsFromSourceOrCache<DataType extends SortableObjectData>(
        ids: string[],
        type: SortableItemTypes,
        loader: () => Promise<SortableItemDto<DataType>[]>,
        cacheFilter: (items: SortableItemDto<DataType>[]) => SortableItemDto<DataType>[] = ((items) => items)
    ): Promise<{[id: string]: SortableItemDto<DataType> | null}> {

        let loaded = new Map<string, SortableItemDto<DataType> | null>(ids.map(id => [id, null]));

        this.getItemsFromCache<DataType>(ids, type).forEach(cachedItem => {
            console.log(`Loaded from cache: [${type}:${cachedItem.id}]`);
            loaded.set(cachedItem.id, cachedItem);
        });

        let loadFromSource: string[] = [];
        loaded.forEach((value, key) => {
            if (value === null) {
                loadFromSource.push(key);
            }
        });

        let items = await loader();
        items.forEach(fromSourceItem => {
            let item: SortableItemDto<DataType> = {
                id: fromSourceItem.id,
                data: fromSourceItem.data
            };
            console.log(`Loaded from source: [${type}:${item.id}]`);
            loaded.set(item.id, item);
        });

        const toCache = cacheFilter(JSON.parse(JSON.stringify(items)));
        toCache.forEach(item => {
            this.storeItemInCache(item, type);
        });

        return Object.fromEntries(loaded.entries());
    }

    /**
     * Gets list of sortable items from database, or from cache if they exist there.
     * 
     * This will also cache items from the source in memory for later use.
     * 
     * This is a special case of {@link getItemsFromSourceOrCache} where the loader gets items from the database.
     *
     * @param ids - List of item IDs to get its for.
     * @param type - Type of sortable item to get.
     * @param cacheFilter - Lambda function used for filtering source items before they are cached. This should be used for removing any data that is request-specific (ex: data for a particular user) and keeping globally valid data. By default this filter will do nothing.
     * @returns Map of sortable item IDs to items. Null value means the item could not be found in either the cache or the source.
     */
    async getItemsFromDbOrCache<DataType extends SortableObjectData>(
        ids: string[],
        type: SortableItemTypes,
        cacheFilter: (items: SortableItemDto<DataType>[]) => SortableItemDto<DataType>[] = ((items) => items)
    ): Promise<{[id: string]: SortableItemDto<DataType> | null}> {
        let loaded = await this.getItemsFromSourceOrCache<DataType>(
            ids,
            type,
            async () => {
                const dbItems = await this._sortableItemDatabase.findSortableItems(ids, type);
                return dbItems.map(row => {
                    return {
                        id: row.id,
                        data: JSON.parse(row.data)
                    };
                })
            },
            cacheFilter
        );

        return loaded;
    }

    /**
     * Stores a single sortable item in memory cache.
     *
     * @param item - Sortable item to store.
     * @param type - Type of the sortable item to store.
     */
    private storeItemInCache(item: SortableItemDto<any>, type: SortableItemTypes) {
        this._sortablesCache.set(`${type}~${item.id}`, item);
    }

    /**
     * Stores multiple sortable items in memory cache.
     * 
     * See {@link storeItemInCache}.
     *
     * @param items - Sortable items to store.
     * @param type - Type of the sortable items to store.
     */
    private storeItemsInCache(items: SortableItemDto<any>[], type: SortableItemTypes) {
        items.forEach(item => {
            this.storeItemInCache(item, type);
        });
    }

    /**
     * Get multiple sortable items from memory cache.
     * 
     * See {@link storeItemInCache}.
     * 
     * See {@link storeItemsInCache}.
     *
     * @param ids - List of item IDs to retrieve.
     * @param type - Type of the sortable items to get.
     */
    private getItemsFromCache<DataType extends SortableObjectData>(
        ids: string[],
        type: SortableItemTypes
    ): SortableItemDto<DataType>[] {
        let cachedItems: SortableItemDto<DataType>[] = [];

        ids.forEach(id => {
            const item = this._sortablesCache.get(`${type}~${id}`);
            if (item) {
                cachedItems.push(item);
            }
        });

        return cachedItems;
    }
}
