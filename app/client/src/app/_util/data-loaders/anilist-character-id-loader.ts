import { BaseLoader } from "./base-loader";
import { AnilistCharacterSortable } from "src/app/_objects/sortables/anilist-character";

export class AnilistCharacterIdLoader extends BaseLoader<AnilistCharacterSortable> {
    static override identifier: string = "anilist-character-id";

    override async getSortables(ids: number[]): Promise<AnilistCharacterSortable[]> {
        let items = await this.dataLoader.anilist.charactersByIds.query({ ids: ids });
        return items.map(item => new AnilistCharacterSortable(item));
    }
}
