import { AnilistStaff } from "../server/anilist/anilist-staff";
import { CharacterSortable } from "./character";

export class AnilistStaffSortable extends CharacterSortable {
    nameNative: string;

    constructor(
        id: string,
        imageUrl: string,
        name: string,
        age?: string,
        gender?: string,
        favourites?: number,
        nameNative?: string
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
        if (language && language == "native") {
            return this.nameNative;
        }
        else {
            return this.name;
        }
    }

    override getLink(): string | null {
        return `https://anilist.co/staff/${this.id}`
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
            data.age ? data.age : undefined,
            data.gender ? data.gender : undefined,
            data.favourites ? data.favourites : undefined,
            data.name_native ? data.name_native : undefined
        );
    }
}
