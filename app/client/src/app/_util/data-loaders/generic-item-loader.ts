import { SortableItemDto } from "@sorter/api/src/objects/sortable";
import { GenericSortableData } from "@sorter/api/src/objects/sortables/generic-item";
import { BaseLoader } from "./base-loader";
import { GenericSortable } from "src/app/_objects/sortables/generic-item";

type NewGenericItems = { name: string; image: string; }[];

export class GenericItemLoader extends BaseLoader<GenericSortable> {
    static override identifier: string = "generic-item";

    override async getSortables(newItems: NewGenericItems): Promise<GenericSortable[]> {
        let items = await this.dataLoader.generic.query(newItems);
        return items.map(item => new GenericSortable(item as SortableItemDto<GenericSortableData>));
    }
}
