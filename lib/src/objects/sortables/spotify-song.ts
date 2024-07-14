import { SortableObjectData } from "./sortable";

export interface SpotifySongSortableData extends SortableObjectData {
    name: string;
    artistIds: string[];
    previewUrl: string;
    local: boolean;
    artists?: SortableObjectData[];
    duration?: number;
    explicit?: boolean;
}
