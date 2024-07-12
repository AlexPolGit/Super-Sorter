import { SortableObject } from "./sortable";

export class SeriesSortable extends SortableObject {
    name: string;

    constructor(id: string, imageUrl: string, name: string) {
        super(id, imageUrl);
        this.name = name ? name : "";
    }

    override getDisplayName(language?: string): string {
        return this.name;
    }
}
