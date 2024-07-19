import { SortableItemDto, AnilistMediaSortableData } from "@sorter/api";
import { ServerError } from "../_objects/custom-error";
import { AnilistMediaSortable } from "../_objects/sortables/anilist-media";
import { BaseLoader } from "./base-loader";

export class AnilistMediaIdLoader extends BaseLoader<AnilistMediaSortable> {
    static override identifier: string = "anilist-media-id";

    override async getSortables(ids: number[]): Promise<AnilistMediaSortable[]> {
        let items = await this.webService.procedure<SortableItemDto<AnilistMediaSortableData>[]>(this.dataLoader.anilist.mediaByIds.query({ ids: ids }),
        [
            {
                code: 500,
                doAction: (error?: Error) => {
                    throw new ServerError($localize`:@@anilist-error-media-generic-title:Anilist media query failed.`, 500, error);
                }
            }
        ]);
        return items.map(item => new AnilistMediaSortable(item));
    }
}
