import { SortableObject } from "./sortable";
import TAGS from "../../../assets/anilist-tags.json";
import { SortableItemDto, SortableItemTypes } from "@sorter/api/src/objects/sortable";
import { AnilistMediaSortableData } from "@sorter/api/src/objects/sortables/anilist-media";

export interface AnilistDate {
    year: number | null;
    month: number | null;
    day: number | null;
}

export function anilistDateToDate(anilistDate: AnilistDate | undefined) {
    if (!anilistDate) {
        return undefined;
    }
    else if (anilistDate.year === null || anilistDate.month === null || anilistDate.day === null)  {
        return undefined;
    }
    return Date.parse(`${anilistDate.year}-${anilistDate.month}-${anilistDate.day}`);
}

export const ANILIST_GENRES: { value: string, displayName: string }[] = [
    { value: "Action", displayName: $localize`:@@anilist-genre-action:Action` },
    { value: "Adventure", displayName: $localize`:@@anilist-genre-adventure:Adventure` },
    { value: "Comedy", displayName: $localize`:@@anilist-genre-comedy:Comedy` },
    { value: "Drama", displayName: $localize`:@@anilist-genre-drama:Drama` },
    { value: "Ecchi", displayName: $localize`:@@anilist-genre-ecchi:Ecchi` },
    { value: "Fantasy", displayName: $localize`:@@anilist-genre-fantasy:Fantasy` },
    { value: "Horror", displayName: $localize`:@@anilist-genre-horror:Horror` },
    { value: "Mahou Shoujo", displayName: $localize`:@@anilist-genre-mahou-shoujo:Mahou Shoujo` },
    { value: "Mecha", displayName: $localize`:@@anilist-genre-mecha:Mecha` },
    { value: "Music", displayName: $localize`:@@anilist-genre-music:Music` },
    { value: "Mystery", displayName: $localize`:@@anilist-genre-mystery:Mystery` },
    { value: "Psychological", displayName: $localize`:@@anilist-genre-psychological:Psychological` },
    { value: "Romance", displayName: $localize`:@@anilist-genre-romance:Romance` },
    { value: "Sci-Fi", displayName: $localize`:@@anilist-genre-scifi:Sci-Fi` },
    { value: "Slice of Life", displayName: $localize`:@@anilist-genre-sol:Slice of Life` },
    { value: "Sports", displayName: $localize`:@@anilist-genre-sports:Sports` },
    { value: "Supernatural", displayName: $localize`:@@anilist-genre-supernatural:Supernatural` },
    { value: "Thriller", displayName: $localize`:@@anilist-genre-thriller:Thriller` },
    { value: "Hentai", displayName: $localize`:@@anilist-genre-hentai:Hentai` }
];

export const ANILIST_MEDIA_FORMATS: { value: string, displayName: string }[] = [
    { value: "TV", displayName: $localize`:@@anilist-media-format-tv:TV` },
    { value: "TV_SHORT", displayName: $localize`:@@anilist-media-format-tvshort:TV Short` },
    { value: "MOVIE", displayName: $localize`:@@anilist-media-format-movie:Movie` },
    { value: "SPECIAL", displayName: $localize`:@@anilist-media-format-special:Special` },
    { value: "OVA", displayName: $localize`:@@anilist-media-format-ova:OVA` },
    { value: "ONA", displayName: $localize`:@@anilist-media-format-ona:ONA` },
    { value: "MUSIC", displayName: $localize`:@@anilist-media-format-music:Music` },
    { value: "MANGA", displayName: $localize`:@@anilist-media-format-manga:Manga` },
    { value: "NOVEL", displayName: $localize`:@@anilist-media-format-ln:Light Novel` },
    { value: "ONE_SHOT", displayName: $localize`:@@anilist-media-format-oneshot:One Shot` }
];

export const ANILIST_AIRING_SEASONS: { value: string, displayName: string }[] = [
    { value: "WINTER", displayName: $localize`:@@anilist-media-season-winter:Winter (Jan+)` },
    { value: "SPRING", displayName: $localize`:@@anilist-media-season-spring:Spring (Apr+)` },
    { value: "SUMMER", displayName: $localize`:@@anilist-media-season-summer:Summer (Jul+)` },
    { value: "FALL", displayName: $localize`:@@anilist-media-season-fall:Fall (Oct+)` }
];

export const ANILIST_TAGS: { name: string; isAdult: boolean }[] = TAGS.data.MediaTagCollection;

export class AnilistMediaSortable extends SortableObject {
    override type = SortableItemTypes.ANILIST_MEDIA;
    title_romaji?: string;
    title_english?: string;
    title_native?: string;
    favourites?: number;
    meanScore?: number;
    status?: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS";
    format?: "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC" | "MANGA" | "NOVEL" | "ONE_SHOT";
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

    constructor(dto: SortableItemDto<AnilistMediaSortableData>) {
        super(dto);
        this.title_romaji = dto.data.title_romaji;
        this.title_english = dto.data.title_english;
        this.title_native = dto.data.title_native;
        this.favourites = dto.data.favourites;
        this.meanScore = dto.data.meanScore;
        this.status = dto.data.status;
        this.format = dto.data.format;
        this.genres = dto.data.genres;
        this.tags = dto.data.tags;
        this.season = dto.data.season;
        this.seasonYear = dto.data.seasonYear;
        this.userData = dto.data.userData ? dto.data.userData : {};
    }

    override getDisplayName(language?: string): string {   
        if (language == "native" && this.title_native) {
            return this.title_native;
        }
        else if (language == "english" && this.title_english) {
            return this.title_english;
        }
        else {
            return this.title_romaji ? this.title_romaji : $localize`:@@missing-name-placeholder:[Missing Name]`;
        }
    }

    override getDetailedDisplayName(language?: string): string {
        let format = "";
        if (this.format) {
            let find = ANILIST_MEDIA_FORMATS.find(format => format.value === this.format)?.displayName;
            if (find) {
                format = find;
            }
            else {
                format = "?";
            }
        }

        let season = "";
        if (this.season && this.seasonYear) {
            let find = ANILIST_AIRING_SEASONS.find(season => season.value === this.season)?.displayName;
            if (find) {
                season = ` [${$localize`:@@anilist-media-season:${this.seasonYear}:year: ${find}:season:`}]`;
            }
        }

        let userScore = "";
        if (this.userData?.score) {
            userScore = ` [📋${this.userData.score.toFixed(1)}]`;
        }

        let meanScore = "";
        if (this.meanScore) {
            meanScore = ` [👥${this.meanScore.toFixed(1)}]`;
        }

        let favourites = "";
        if (this.favourites) {
            favourites = ` [${this.favourites}⭐]`;
        }

        return `${this.getDisplayName(language)} [${format}]${season}${userScore}${meanScore}${favourites}`
    }

    override getLink(): string | null {
        if (this.format && ["TV", "TV_SHORT", "MOVIE", "SPECIAL", "OVA", "ONA", "MUSIC"].indexOf(this.format) !== -1) {
            return `https://anilist.co/anime/${this.id}`
        }
        else if (this.format && ["MANGA", "NOVEL", "ONE_SHOT"].indexOf(this.format) !== -1) {
            return `https://anilist.co/manga/${this.id}`
        }
        else {
            return null;
        }
    }
}
