import { SortableObject } from "./sortable";

export class CharacterSortable extends SortableObject {
    name: string;
    age: string | null;
    gender: string | null;

    constructor(
        id: string,
        imageUrl: string,
        name: string,
        age: string | null,
        gender: string | null
    ) {
        super(id, imageUrl);
        this.name = name ? name : "";
        this.age = age;
        this.gender = gender;
    }

    override getDisplayName(language?: string): string {
        return this.name;
    }
}
