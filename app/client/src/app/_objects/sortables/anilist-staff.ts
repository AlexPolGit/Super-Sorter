import { SortableItemDto, SortableItemTypes } from "../../../../../lib/src/objects/sortable";
import { AnilistStaffSortableData } from "../../../../../lib/src/objects/sortables/anilist-staff";
import { SortableObject } from "./sortable";

export class AnilistStaffSortable extends SortableObject {
    override type = "anilist-staff" as SortableItemTypes;
    name: string;
    nameNative: string;
    age?: string;
    gender?: string;
    favourites?: number;

    constructor(dto: SortableItemDto<AnilistStaffSortableData>) {
        super(dto);
        this.name = dto.data.name;
        this.nameNative = dto.data.nameNative ? dto.data.nameNative : dto.data.name;
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
        return `https://anilist.co/staff/${this.id}`;
    }
}
