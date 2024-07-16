import { SortableItemDto } from "@sorter/api/src/objects/sortable.js";
import { GenericSortableData } from "@sorter/api/src/objects/sortables/generic-item.js";
import { BaseLoader } from "../base-loader.js";

interface NewGenericItems {
    owner: string;
    items: {
        name: string;
        image: string;
    }[];
}

export class GenericItemLoader extends BaseLoader {
    override async loadItemsFromSource(newItems: NewGenericItems): Promise<SortableItemDto<GenericSortableData>[]> {
        return newItems.items.map(item => {
            return {
                id: `${newItems.owner}-${item.name}-${Buffer.from(item.image).toString('base64')}`,
                data: {
                    imageUrl: item.image,
                    name: item.name,
                    owner: newItems.owner
                }
            }
        });
    }
}
