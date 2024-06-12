import { AnilistCharacter } from "../server/anilist/anilist-character";
import { CharacterSortable } from "./character";

export class AnilistCharacterSortable extends CharacterSortable {
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
            data.name_native ? data.name_native : undefined,
            data.age ? data.age : undefined,
            data.gender ? data.gender : undefined,
            data.favourites ? data.favourites : undefined
        );
    }
}
