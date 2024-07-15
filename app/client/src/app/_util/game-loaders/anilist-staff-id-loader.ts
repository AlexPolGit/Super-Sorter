import { BaseLoader } from "./base-loader";
import { AnilistStaffSortable } from "src/app/_objects/sortables/anilist-staff";

export class AnilistStaffIdLoader extends BaseLoader<AnilistStaffSortable> {
    static override identifier: string = "anilist-staff-id";

    override async getSortables(ids: number[]): Promise<AnilistStaffSortable[]> {
        let items = await this.dataLoader.anilist.staffByIds.query({ ids: ids });
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
