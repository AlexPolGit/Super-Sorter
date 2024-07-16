import { SortableItemDto } from "../../../../lib/src/objects/sortable.js";

export abstract class BaseLoader {
    abstract loadItemsFromSource(query: any): Promise<SortableItemDto<any>[]>;
}