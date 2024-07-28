import { SortableItemDto, SortableItemTypes, SteamGameSortableData } from "@sorter/api";
import { SortableObject } from "./sortable";

export class SteamGameSortable extends SortableObject {
    override type = "steam-game" as SortableItemTypes;
    name: string;
    gameType?: "game" | "dlc" | "demo" | "advertising" | "mod" | "video";
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
    releaseDate?: number;
    userDetails?: {
        playtime: number;
        lastPlayed?: number;
    };
    completeData: boolean;

    constructor(dto: SortableItemDto<SteamGameSortableData>) {
        super(dto);
        this.name = dto.data.name;
        this.gameType = dto.data.type;
        this.requiredAge = dto.data.requiredAge;
        this.free = dto.data.free;
        this.developers = dto.data.developers;
        this.publishers = dto.data.publishers;
        this.platforms = dto.data.platforms;
        this.categories = dto.data.categories;
        this.genres = dto.data.genres;
        this.releaseDate = dto.data.releaseDate ? Date.parse(dto.data.releaseDate) : undefined;
        this.userDetails = dto.data.userDetails;
        if (this.userDetails?.playtime) {
            this.userDetails.playtime = Math.round(this.userDetails.playtime / 60);
        }
        this.completeData = dto.data.completeData;
    }

    override getDisplayName(): string {
        return this.name;
    }

    override getDetailedDisplayName(language?: string): string {
        let mainDeveloper = "";
        if (this.developers && this.developers.length > 0) {
            mainDeveloper = ` [${this.developers[0]}]`;
        }

        let releaseYear = "";
        if (this.releaseDate) {
            releaseYear = ` [📅${(new Date(this.releaseDate)).toLocaleDateString(language)}]`;
        }

        let playTime = "";
        if (this.userDetails?.playtime) {
            playTime = ` [⌛${$localize`:@@steam-game-hours:${this.userDetails.playtime}:hours: Hr`}]`;
        }

        return `${this.getDisplayName()}${mainDeveloper}${releaseYear}${playTime}`;
    }

    override getLink(): string | null {
        return `https://store.steampowered.com/app/${this.id}`;
    }
}
