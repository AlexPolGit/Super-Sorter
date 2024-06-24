import { AnilistMedia } from "../server/anilist/anilist-media";
import { SortableObject } from "./sortable";
import TAGS from "../../../assets/anilist-tags.json";

export interface AnilistDate {
    year: number;
    month: number;
    day: number;
}

export function anilistDateToDate(anilistDate: AnilistDate) {
    return Date.parse(`${anilistDate.year}-${anilistDate.month}-${anilistDate.day}`);
}

export const ANILIST_GENRES: string[] = [
    $localize`:@@anilist-genre-action:Action`,
    $localize`:@@anilist-genre-adventure:Adventure`,
    $localize`:@@anilist-genre-comedy:Comedy`,
    $localize`:@@anilist-genre-drama:Drama`,
    $localize`:@@anilist-genre-ecchi:Ecchi`,
    $localize`:@@anilist-genre-fantasy:Fantasy`,
    $localize`:@@anilist-genre-horror:Horror`,
    $localize`:@@anilist-genre-mahou-shoujo:Mahou Shoujo`,
    $localize`:@@anilist-genre-mecha:Mecha`,
    $localize`:@@anilist-genre-music:Music`,
    $localize`:@@anilist-genre-mystery:Mystery`,
    $localize`:@@anilist-genre-psychological:Psychological`,
    $localize`:@@anilist-genre-romance:Romance`,
    $localize`:@@anilist-genre-scifi:Sci-Fi`,
    $localize`:@@anilist-genre-sol:Slice Of Life`,
    $localize`:@@anilist-genre-sports:Sports`,
    $localize`:@@anilist-genre-supernatural:Supernatural`,
    $localize`:@@anilist-genre-thriller:Thriller`,
    $localize`:@@anilist-genre-hentai:Hentai`
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
    { value: "WINTER", displayName: $localize`:@@anilist-media-season-winter:Winter` },
    { value: "SPRING", displayName: $localize`:@@anilist-media-season-spring:Spring` },
    { value: "SUMMER", displayName: $localize`:@@anilist-media-season-summer:Summer` },
    { value: "FALL", displayName: $localize`:@@anilist-media-season-fall:Fall` }
];

export const ANILIST_TAGS: string[] = TAGS.data.MediaTagCollection.map(tag => tag.name);

export class AnilistMediaSortable extends SortableObject {
    title_romaji: string | null;
    title_english: string | null;
    title_native: string | null;
    favourites: number | null;
    meanScore: number | null;
    status: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS" | null;
    format: "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC" | "MANGA" | "NOVEL" | "ONE_SHOT" | null;
    genres: string[] | null;
    tags: string[] | null;
    season: "WINTER" | "SPRING" | "SUMMER" | "FALL" | null;
    seasonYear: number | null;
    userData: {
        score: number | null;
        status: string | null;
        startedAt: AnilistDate | null;
        completedAt: AnilistDate | null;
    };

    constructor(
        id: string,
        imageUrl: string,
        title_romaji?: string,
        title_english?: string,
        title_native?: string,
        favourites?: number,
        meanScore?: number,
        status?: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS",
        format?: "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC" | "MANGA" | "NOVEL" | "ONE_SHOT",
        genres?: string[],
        tags?: string[],
        season?: "WINTER" | "SPRING" | "SUMMER" | "FALL",
        seasonYear?: number,
        userScore?: number,
        userStatus?: string,
        userStartedDate?: AnilistDate,
        userCompletedData?: AnilistDate
    ) {
        super(id, imageUrl);
        this.title_romaji = title_romaji ? title_romaji : null;
        this.title_english = title_english ? title_english : null;
        this.title_native = title_native ? title_native : null;
        this.favourites = favourites ? favourites : null;
        this.meanScore = meanScore ? meanScore : null;
        this.status = status ? status : null;
        this.format = format ? format : null;
        this.genres = genres ? genres : null;
        this.tags = tags ? tags : null;
        this.season = season ? season : null;
        this.seasonYear = seasonYear ? seasonYear : null;
        this.userData = {
            score: userScore ? userScore : null,
            status: userStatus ? userStatus : null,
            startedAt: userStartedDate ? userStartedDate : null,
            completedAt: userCompletedData ? userCompletedData : null
        };
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

        let meanScore = "";
        if (this.meanScore) {
            meanScore = ` [${this.meanScore}]`;
        }

        let userScore = "";
        if (this.userData.score) {
            userScore = ` [${this.userData.score}]`;
        }

        return `${this.getDisplayName(language)} [${format}]${season}${meanScore}${userScore}`
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
            data.title_romaji ? data.title_romaji :  undefined,
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
