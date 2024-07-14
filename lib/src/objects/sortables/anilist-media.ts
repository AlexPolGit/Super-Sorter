import { SortableObjectData } from "./sortable";

export interface AnilistDate {
    year: number | null;
    month: number | null;
    day: number | null;
}

export interface AnilistMediaSortableData extends SortableObjectData {
    title_romaji: string;
    title_english: string;
    title_native: string;
    format: "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC" | "MANGA" | "NOVEL" | "ONE_SHOT";
    favourites?: number;
    meanScore?: number;
    status?: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS";
    genres?: string[];
    tags?: string[];
    season?: "WINTER" | "SPRING" | "SUMMER" | "FALL";
    seasonYear?: number;
    userData: {
        score?: number;
        status?: string;
        startedAt?: AnilistDate;
        completedAt?: AnilistDate;
    };
}
