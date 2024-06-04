import { AnilistStaff } from "../server/anilist/anilist-staff";
import { CharacterSortable } from "./character";

export class AnilistStaffSortable extends CharacterSortable {
    nameNative: string;

    constructor(id: string, imageUrl: string, name: string, nameNative: string) {
        super(id, imageUrl, name);
        this.nameNative = nameNative;
    }

    override getDisplayName(): string {
        return this.nameNative;
    }

    getStaffData(): AnilistStaff {
        return {
            id: this.id,
            name_full: this.name,
            name_native: this.nameNative,
            image: this.imageUrl
        }
    }

    static fromStaffData(data: AnilistStaff): AnilistStaffSortable {
        return new AnilistStaffSortable(data.id, data.image, data.name_full, data.name_native);
    }
}
