import { SortableObject } from "./sortable";

export class GenericSortable extends SortableObject {
    name: string;
    metadata: any;

    constructor(
        id: string,
        imageUrl: string,
        name: string,
        metadata?: any
    ) {
        super(id, imageUrl);
        this.name = name ? name : "";
        this.metadata = metadata ? metadata : null;
    }

    override getDisplayName(language?: string): string {
        return this.name;
    }
}