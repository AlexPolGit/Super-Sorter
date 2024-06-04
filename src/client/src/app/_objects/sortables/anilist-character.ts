import { AnilistCharacter } from "../server/anilist/anilist-character";
import { CharacterSortable } from "./character";

export class AnilistCharacterSortable extends CharacterSortable {
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

    override getDisplayName(language?: "full" | "native"): string {
        if (language && language == "native") {
            return this.nameNative;
        }
        else {
            return this.name;
        }
    }

    override getLink(): string | null {
        return `https://anilist.co/character/${this.id}`
    }

    getCharacterData(): AnilistCharacter {
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

    static fromCharacterData(data: AnilistCharacter): AnilistCharacterSortable {
        return new AnilistCharacterSortable(
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
