import { SortableItemDto } from "../../../../../lib/src/objects/sortable";
import { AnilistMediaSortableData } from "../../../../../lib/src/objects/sortables/anilist-media";
import { BaseLoader } from "./base-loader";
import { AnilistMediaSortable } from "src/app/_objects/sortables/anilist-media";

export interface UserListFilters {
    userName: string;
    statuses: string[];
    anime: boolean;
    manga: boolean;
    tagPercentMinimum: number;
}

export class AnilistMediaUserListLoader extends BaseLoader<AnilistMediaSortable> {
    static override identifier: string = "anilist-media-user-list";

    override async getSortables(filters: UserListFilters): Promise<AnilistMediaSortable[]> {
        let items = await this.dataLoader.anilist.mediaByUserList.query(filters);
        return items.map(item => new AnilistMediaSortable(item as SortableItemDto<AnilistMediaSortableData>));
    }
}
