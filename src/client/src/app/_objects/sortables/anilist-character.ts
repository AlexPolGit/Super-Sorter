import { AnilistCharacter } from "../server/anilist/anilist-character";
import { CharacterSortable } from "./character";

export class AnilistCharacterSortable extends CharacterSortable {
    nameNative: string;

    constructor(id: string, imageUrl: string, name: string, nameNative: string) {
        super(id, imageUrl, name);
        this.nameNative = nameNative;
    }

    override getDisplayName(): string {
        return this.nameNative;
    }

    override getLink(): string | null {
        return `https://anilist.co/character/${this.id}`
    }

    getCharacterData(): AnilistCharacter {
        return {
            id: this.id,
            name_full: this.name,
            name_native: this.nameNative,
            image: this.imageUrl
        }
    }

    static fromCharacterData(data: AnilistCharacter): AnilistCharacterSortable {
        return new AnilistCharacterSortable(data.id, data.image, data.name_full, data.name_native);
    }
}
