import { SortableItemDto, AnilistMediaSortableData } from "@sorter/api";
import { UserError } from "../_objects/custom-error";
import { AnilistMediaSortable } from "../_objects/sortables/anilist-media";
import { BaseLoader } from "./base-loader";

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
        let items = await this.webService.procedure<SortableItemDto<AnilistMediaSortableData>[]>(this.dataLoader.anilist.mediaByUserList.query(filters),
        [
            {
                code: 404,
                doAction: () => {
                    throw new UserError($localize`:@@anilist-error-user-does-not-exist-desc:Anilist user "${filters.userName}" does not exist.`, $localize`:@@anilist-error-user-does-not-exist-title:User Does Not Exist`, 404);
                }
            }
        ]);
        return items.map(item => new AnilistMediaSortable(item));
    }
}
