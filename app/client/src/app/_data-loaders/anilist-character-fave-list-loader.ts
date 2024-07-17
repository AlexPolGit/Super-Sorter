import { SortableItemDto, AnilistCharacterSortableData } from "@sorter/api";
import { AnilistCharacterSortable } from "../_objects/sortables/anilist-character";
import { BaseLoader } from "./base-loader";

export class AnilistCharacterFaveListLoader extends BaseLoader<AnilistCharacterSortable> {
    static override identifier: string = "anilist-character-fave-list";

    override async getSortables(username: string): Promise<AnilistCharacterSortable[]> {
        let items = await this.dataLoader.anilist.charactersByFavouritesList.query({ username: username });
        return items.map(item => new AnilistCharacterSortable(item as SortableItemDto<AnilistCharacterSortableData>));
    }
}
