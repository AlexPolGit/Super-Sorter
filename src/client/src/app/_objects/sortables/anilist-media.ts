import { AnilistMedia } from "../server/anilist/anilist-media";
import { SortableObject } from "./sortable";

export class AnilistMediaSortable extends SortableObject {
    title_romaji: string;
    title_english: string | null;
    title_native: string | null;
    favourites: number | null;
    meanScore: number | null;
    status: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS" | null;
    format: "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC" | "MANGA" | "NOVEL" | "ONE_SHOT" | null;
    genres: string[] | null;

    constructor(
        id: string,
        imageUrl: string,
        title_romaji: string,
        title_english?: string,
        title_native?: string,
        favourites?: number,
        meanScore?: number,
        status?: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS",
        format?: "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC" | "MANGA" | "NOVEL" | "ONE_SHOT",
        genres?: string[]
    ) {
        super(id, imageUrl);
        this.title_romaji = title_romaji;
        this.title_english = title_english ? title_english : null;
        this.title_native = title_native ? title_native : null;
        this.favourites = favourites ? favourites : null;
        this.meanScore = meanScore ? meanScore : null;
        this.status = status ? status : null;
        this.format = format ? format : null;
        this.genres = genres ? genres : null;
    }

    override getDisplayName(language?: string): string {   
        if (language == "native" && this.title_native) {
            return this.title_native;
        }
        else if (language == "english" && this.title_english) {
            return this.title_english;
        }
        else {
            return this.title_romaji;
        }
    }

    override getLink(): string | null {
        return `https://anilist.co/anime/${this.id}`
    }

    getMediaData(): AnilistMedia {
        return {
            id: this.id,
            image: this.imageUrl,
            title_romaji: this.title_romaji,
            title_english: this.title_english,
            title_native: this.title_native,
            favourites: this.favourites,
            mean_score: this.meanScore,
            status: this.status,
            format: this.format,
            genres: this.genres ? this.genres.join("|") : ""
        }
    }

    static fromMediaData(data: AnilistMedia): AnilistMediaSortable {
        return new AnilistMediaSortable(
            data.id,
            data.image,
            data.title_romaji,
            data.title_english ? data.title_english :  undefined,
            data.title_native ? data.title_native : undefined,
            data.favourites ? data.favourites : undefined,
            data.mean_score ? data.mean_score : undefined,
            data.status ? data.status : undefined,
            data.format ? data.format : undefined,
            data.genres ? data.genres.split("") : undefined
        );
    }
}
