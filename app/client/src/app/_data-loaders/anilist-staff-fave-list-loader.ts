import { SortableItemDto, AnilistStaffSortableData } from "@sorter/api";
import { AnilistStaffSortable } from "../_objects/sortables/anilist-staff";
import { BaseLoader } from "./base-loader";

export class AnilistStaffFaveListLoader extends BaseLoader<AnilistStaffSortable> {
    static override identifier: string = "anilist-staff-fave-list";

    override async getSortables(username: string): Promise<AnilistStaffSortable[]> {
        let items = await this.dataLoader.anilist.staffByFavouritesList.query({ username: username });
        return items.map(item => new AnilistStaffSortable(item as SortableItemDto<AnilistStaffSortableData>));
    }
}
