import { LRUCache } from 'lru-cache'
import { getEnvironmentVariable } from '../util/env.js';
import { SortableItemDto, SortableItemTypes } from '@sorter/api/src/objects/sortable.js';

export interface CacheKey {
    id: string;
    type: string;
}

export abstract class SortableItemMananger {
    sortablesCache: LRUCache<CacheKey, SortableItemDto>;

    constructor() {
        const cacheSize = parseInt(getEnvironmentVariable("SORTABLE_ITEM_CACHE_SIZE", false, "10000"));
        this.sortablesCache = new LRUCache({ max: cacheSize });
    }

    storeItems(items: SortableItemDto[], type: SortableItemTypes) {
        items.forEach(item => {
            this.sortablesCache.set({ id: item.id, type: type }, item);
        });
    }

    getItems(ids: string[], type: SortableItemTypes): SortableItemDto[] {
        let allItems = this.getItemsFromCache(ids, type);

        
        
        return Array.from(allItems).map(([name, value]) => value);
    }

    private getItemsFromCache(ids: string[], type: SortableItemTypes): Map<string, SortableItemDto> {
        let cachedItems = new Map<string, SortableItemDto>();

        ids.forEach(id => {
            const item = this.sortablesCache.get({ id: id, type: type });
            if (item) {
                cachedItems.set(id, item);
            }
        });

        return cachedItems;
    }
}
