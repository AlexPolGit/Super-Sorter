import { SortableItemDto } from "@sorter/api/src/objects/sortable";
import { AnilistMediaSortableData } from "@sorter/api/src/objects/sortables/anilist-media";
import { BaseLoader } from "./base-loader";
import { AnilistMediaSortable } from "src/app/_objects/sortables/anilist-media";

export class AnilistMediaFaveListLoader extends BaseLoader<AnilistMediaSortable> {
    static override identifier: string = "anilist-media-fave-list";

    override async getSortables(username: string): Promise<AnilistMediaSortable[]> {
        let items = await this.dataLoader.anilist.mediaByFavouritesList.query({ username: username });
        return items.map(item => new AnilistMediaSortable(item as SortableItemDto<AnilistMediaSortableData>));
    }
}
