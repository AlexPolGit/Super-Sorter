import { SortableObjectData } from "./sortable";

export interface AnilistCharacterSortableData extends SortableObjectData {
    name: string;
    nameNative: string;
    age?: string;
    gender?: string;
    favourites?: number;
}
