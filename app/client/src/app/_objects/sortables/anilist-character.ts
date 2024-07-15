import { SortableItemDto, SortableItemTypes } from "@sorter/api/src/objects/sortable";
import { SortableObject } from "./sortable";
import { AnilistCharacterSortableData } from "@sorter/api/src/objects/sortables/anilist-character";

export class AnilistCharacterSortable extends SortableObject {
    override type = SortableItemTypes.ANILIST_CHARACTER;
    name: string;
    nameNative: string;
    age?: string;
    gender?: string;
    favourites?: number;

    constructor(dto: SortableItemDto<AnilistCharacterSortableData>) {
        super(dto);
        this.name = dto.data.name;
        this.nameNative = dto.data.nameNative;
        this.age = dto.data.age;
        this.gender = dto.data.gender;
        this.favourites = dto.data.favourites;
    }

    override getDisplayName(language?: string): string {   
        if (language === "native") {
            return this.nameNative;
        }
        else {
            return this.name;
        }
    }

    override getDetailedDisplayName(language?: string): string {
        let age = "";
        if (this.age) {
            age = `[${this.age}]`;
        }

        let gender = "";
        if (this.gender === "Male") {
            gender = " [♂]";
        }
        else if (this.gender === "Female") {
            gender = " [♀]";
        }
        else if (this.gender !== null) {
            gender = " [△]";
        }

        let favourites = "";
        if (this.favourites) {
            favourites = ` [${this.favourites}⭐]`;
        }

        return `${this.getDisplayName(language)} ${age}${gender}${favourites}`
    }

    override getLink(): string | null {
        return `https://anilist.co/character/${this.id}`
    }
}
