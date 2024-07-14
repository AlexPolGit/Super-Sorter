import { SortableObjectData } from "./sortable";

export interface AnilistStaffSortableData extends SortableObjectData {
    name: string;
    nameNative: string;
    age?: string;
    gender?: string;
    favourites?: number;
}
