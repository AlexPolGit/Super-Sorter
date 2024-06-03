import { Character } from "./character";

export class AnilistCharacter extends Character {
    constructor(id: string, imageUrl?: string, name?: string) {
        super(id, imageUrl, name);
    }
}
