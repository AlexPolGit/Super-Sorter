import { SortableItemDto, SortableItemTypes } from "@sorter/api/src/objects/sortable";
import { SortableObject } from "./sortable";
import { GenericSortableData } from "@sorter/api/src/objects/sortables/generic-item";

export class GenericSortable extends SortableObject {
    override type = "generic-items" as SortableItemTypes;
    name: string;

    constructor(dto: SortableItemDto<GenericSortableData>) {
        super(dto);
        this.name = dto.data.name;
    }

    override getDisplayName(language?: string): string {
        return this.name;
    }
}