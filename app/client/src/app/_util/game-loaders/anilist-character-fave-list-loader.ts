import { BaseLoader } from "./base-loader";
import { AnilistCharacterSortable } from "src/app/_objects/sortables/anilist-character";

export class AnilistCharacterFaveListLoader extends BaseLoader<AnilistCharacterSortable> {
    static override identifier: string = "anilist-character-fave-list";

    override async getSortables(username: string): Promise<AnilistCharacterSortable[]> {
        let items = await this.dataLoader.anilist.charactersByFavouritesList.query({ username: username });
        return items.map(item => new AnilistCharacterSortable(
            item.id,
            item.data.imageUrl,
            item.data.name,
            item.data.nameNative ? item.data.nameNative : null,
            item.data.age ? item.data.age : null,
            item.data.gender ? item.data.gender : null,
            item.data.favourites ? item.data.favourites : null
        ));
    }
}
