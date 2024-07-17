import { SortableItemDto, SortableItemTypes, GenericSortableData } from "@sorter/api";
import { SortableObject } from "./sortable";

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