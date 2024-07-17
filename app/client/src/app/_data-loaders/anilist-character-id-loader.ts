import { SortableItemDto, AnilistCharacterSortableData } from "@sorter/api";
import { AnilistCharacterSortable } from "../_objects/sortables/anilist-character";
import { BaseLoader } from "./base-loader";

export class AnilistCharacterIdLoader extends BaseLoader<AnilistCharacterSortable> {
    static override identifier: string = "anilist-character-id";

    override async getSortables(ids: number[]): Promise<AnilistCharacterSortable[]> {
        let items = await this.webService.procedure<SortableItemDto<AnilistCharacterSortableData>[]>(this.dataLoader.anilist.charactersByIds.query({ ids: ids }));
        return items.map(item => new AnilistCharacterSortable(item));
    }
}
