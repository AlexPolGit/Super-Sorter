import { SortableObject } from "./sortable";

export class CharacterSortable extends SortableObject {
    name: string;
    age: string | null;
    gender: string | null;
    favourites: number | null;

    constructor(
        id: string,
        imageUrl: string,
        name: string,
        age?: string,
        gender?: string,
        favourites?: number
    ) {
        super(id, imageUrl);
        this.name = name ? name : "";
        this.age = age ? age : null;
        this.gender = gender ? gender : null;
        this.favourites = favourites ? favourites : null;
    }

    override getDisplayName(): string {
        return this.name;
    }
}
