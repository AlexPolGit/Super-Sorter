import { AnilistStaff } from "../server/anilist/anilist-staff";
import { CharacterSortable } from "./character";

export class AnilistStaffSortable extends CharacterSortable {
    nameNative: string;

    constructor(
        id: string,
        imageUrl: string,
        name: string,
        nameNative?: string,
        age?: string,
        gender?: string,
        favourites?: number
    ) {
        super(id, imageUrl, name, age, gender, favourites);
        if (nameNative) {
            this.nameNative = nameNative;
        }
        else {
            this.nameNative = this.name;
        }
    }

    override getDisplayName(language?: string): string {
        if (language === "native") {
            return this.nameNative;
        }
        else {
            return this.name;
        }
    }

    override getLink(): string | null {
        return `https://anilist.co/staff/${this.id}`;
    }

    getStaffData(): AnilistStaff {
        return {
            id: this.id,
            name_full: this.name,
            name_native: this.nameNative,
            image: this.imageUrl,
            age: this.age,
            gender: this.gender,
            favourites: this.favourites
        }
    }

    static fromStaffData(data: AnilistStaff): AnilistStaffSortable {
        return new AnilistStaffSortable(
            data.id,
            data.image,
            data.name_full,
            data.name_native ? data.name_native : undefined,
            data.age ? data.age : undefined,
            data.gender ? data.gender : undefined,
            data.favourites ? data.favourites : undefined
        );
    }
}
