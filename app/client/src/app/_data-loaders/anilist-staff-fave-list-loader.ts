import { SortableItemDto, AnilistStaffSortableData } from "@sorter/api";
import { AnilistStaffSortable } from "../_objects/sortables/anilist-staff";
import { UserError } from "../_objects/custom-error";
import { BaseLoader } from "./base-loader";

export class AnilistStaffFaveListLoader extends BaseLoader<AnilistStaffSortable> {
    static override identifier: string = "anilist-staff-fave-list";

    override async getSortables(username: string): Promise<AnilistStaffSortable[]> {
        let items = await this.webService.procedure<SortableItemDto<AnilistStaffSortableData>[]>(this.dataLoader.anilist.staffByFavouritesList.query({ username: username }),
        [
            {
                code: 404,
                doAction: () => {
                    throw new UserError($localize`:@@anilist-error-user-does-not-exist-desc:Anilist user "${username}:username:" does not exist.`, $localize`:@@anilist-error-user-does-not-exist-title:User Does Not Exist`, 404);
                }
            }
        ]);
        return items.map(item => new AnilistStaffSortable(item));
    }
}
