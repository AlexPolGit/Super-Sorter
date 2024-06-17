import { AnilistStaff } from "../server/anilist/anilist-staff";
import { CharacterSortable } from "./character";

export class AnilistStaffSortable extends CharacterSortable {
    nameNative: string;
    favourites: number | null;

    constructor(
        id: string,
        imageUrl: string,
        name: string,
        nameNative: string | null,
        age: string | null,
        gender: string | null,
        favourites: number | null
    ) {
        super(id, imageUrl, name, age, gender);
        if (nameNative) {
            this.nameNative = nameNative;
        }
        else {
            this.nameNative = this.name;
        }
        this.favourites = favourites;
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
            if (language === "native") {
                age = `[${this.age}歳]`;
            }
            else {
                age = `[${this.age}]`;
            }
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

    getStaffData(): AnilistStaff {
        return {
            id: this.id,
            name_full: this.name,
            name_native: this.nameNative,
            image: this.imageUrl,
            age: this.age ? this.age : null,
            gender: this.gender ? this.gender : null,
            favourites: this.favourites ? this.favourites : null
        }
    }

    static fromStaffData(data: AnilistStaff): AnilistStaffSortable {
        return new AnilistStaffSortable(
            data.id,
            data.image,
            data.name_full,
            data.name_native ? data.name_native : null,
            data.age ? data.age : null,
            data.gender ? data.gender : null,
            data.favourites ? data.favourites : null
        );
    }
}
