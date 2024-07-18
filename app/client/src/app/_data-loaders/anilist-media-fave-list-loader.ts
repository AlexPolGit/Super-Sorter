import { SortableItemDto, AnilistMediaSortableData } from "@sorter/api";
import { UserError } from "../_objects/custom-error";
import { AnilistMediaSortable } from "../_objects/sortables/anilist-media";
import { BaseLoader } from "./base-loader";

export class AnilistMediaFaveListLoader extends BaseLoader<AnilistMediaSortable> {
    static override identifier: string = "anilist-media-fave-list";

    override async getSortables(username: string): Promise<AnilistMediaSortable[]> {
        let items = await this.webService.procedure<SortableItemDto<AnilistMediaSortableData>[]>(this.dataLoader.anilist.mediaByFavouritesList.query({ username: username }),
        [
            {
                code: 404,
                doAction: () => {
                    throw new UserError($localize`:@@anilist-error-user-does-not-exist-desc:Anilist user "${username}:username:" does not exist.`, $localize`:@@anilist-error-user-does-not-exist-title:User Does Not Exist`, 404);
                }
            }
        ]);
        return items.map(item => new AnilistMediaSortable(item));
    }
}
