export interface AnilistMedia {
    id: string;
    image: string;
    title_romaji: string | null;
    title_english: string | null;
    title_native: string | null;
    favourites: number | null;
    mean_score: number | null;
    status: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS" | null;
    format: "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC" | "MANGA" | "NOVEL" | "ONE_SHOT" | null;
    genres: string | null;
}
