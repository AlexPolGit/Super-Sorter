import { BaseLoader } from "./base-loader";
import { AnilistStaffSortable } from "src/app/_objects/sortables/anilist-staff";

export class AnilistStaffIdLoader extends BaseLoader<AnilistStaffSortable> {
    static override identifier: string = "anilist-staff-id";

    override async getSortables(ids: number[]): Promise<AnilistStaffSortable[]> {
        let items = await this.dataLoader.anilist.staffByIds.query({ ids: ids });
        return items.map(item => new AnilistStaffSortable(item));
    }
}
