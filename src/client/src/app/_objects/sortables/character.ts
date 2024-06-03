import { SortableObject } from "./sortable";

export class Character extends SortableObject {
    name: string;

    constructor(id: string, imageUrl?: string, name?: string) {
        super(id, imageUrl);
        this.name = name ? name : "CHARACTER_NAME";
    }

    override getDisplayName(): string {
        return this.name;
    }
}
