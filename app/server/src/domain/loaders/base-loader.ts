import { SortableItemDto } from "@sorter/api";

export abstract class BaseLoader {
    abstract loadItemsFromSource(query: any): Promise<SortableItemDto<any>[]>;
}
