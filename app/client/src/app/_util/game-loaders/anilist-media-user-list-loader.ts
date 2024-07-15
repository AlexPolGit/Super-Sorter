import { BaseLoader } from "./base-loader";
import { AnilistMediaSortable } from "src/app/_objects/sortables/anilist-media";

export interface UserListFilters {
    userName: string;
    statuses: string[];
    anime: boolean;
    manga: boolean;
    tagPercentMinimum: number;
}

export class AnilistMediaFaveListLoader extends BaseLoader<AnilistMediaSortable> {
    static override identifier: string = "anilist-media-fave-list";

    override async getSortables(filters: UserListFilters): Promise<AnilistMediaSortable[]> {
        let items = await this.dataLoader.anilist.mediaByUserList.query(filters);
        return items.map(item => new AnilistMediaSortable(
            item.id,
            item.data.imageUrl,
            item.data.title_romaji,
            item.data.title_english,
            item.data.title_english,
            item.data.favourites,
            item.data.meanScore,
            item.data.status,
            item.data.format,
            item.data.genres,
            item.data.tags,
            item.data.season,
            item.data.seasonYear
        ));
    }
}
