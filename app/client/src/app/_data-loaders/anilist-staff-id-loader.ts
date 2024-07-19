import { SortableItemDto, AnilistStaffSortableData } from "@sorter/api";
import { ServerError } from "../_objects/custom-error";
import { AnilistStaffSortable } from "../_objects/sortables/anilist-staff";
import { BaseLoader } from "./base-loader";

export class AnilistStaffIdLoader extends BaseLoader<AnilistStaffSortable> {
    static override identifier: string = "anilist-staff-id";

    override async getSortables(ids: number[]): Promise<AnilistStaffSortable[]> {
        let items = await this.webService.procedure<SortableItemDto<AnilistStaffSortableData>[]>(this.dataLoader.anilist.staffByIds.query({ ids: ids }),
        [
            {
                code: 500,
                doAction: (error?: Error) => {
                    throw new ServerError($localize`:@@anilist-error-staff-generic-title:Anilist staff query failed.`, 500, error);
                }
            }
        ]);
        return items.map(item => new AnilistStaffSortable(item));
    }
}
