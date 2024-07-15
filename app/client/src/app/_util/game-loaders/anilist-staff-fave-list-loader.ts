import { BaseLoader } from "./base-loader";
import { AnilistStaffSortable } from "src/app/_objects/sortables/anilist-staff";

export class AnilistStaffFaveListLoader extends BaseLoader<AnilistStaffSortable> {
    static override identifier: string = "anilist-staff-fave-list";

    override async getSortables(username: string): Promise<AnilistStaffSortable[]> {
        let items = await this.dataLoader.anilist.staffByFavouritesList.query({ username: username });
        return items.map(item => new AnilistStaffSortable(
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
