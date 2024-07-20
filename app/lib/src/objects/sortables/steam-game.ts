import { SortableObjectData } from "./sortable";

export interface SteamGameSortableData extends SortableObjectData {
    name: string;
    type?: string;
    requiredAge?: number;
    free?: boolean;
    developers?: string[];
    publishers?: string[];
    platforms?: {
        windows: boolean;
        mac: boolean;
        linux: boolean;
    };
    categories?: string[];
    genres?: string[];
    releaseDate?: string;
    userDetails?: {
        playtime: number;
        lastPlayed: number;
    };
    completeData: boolean;
    lastUpdated: number;
}
