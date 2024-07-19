import { SortableItemDto, SpotifySongSortableData } from "@sorter/api";
import { ServerError } from "../_objects/custom-error";
import { SpotifySongSortable } from "../_objects/sortables/spotify-song";
import { BaseLoader } from "./base-loader";

export class SpotifySongIdLoader extends BaseLoader<SpotifySongSortable> {
    static override identifier: string = "spotify-song-id";

    override async getSortables(ids: string[]): Promise<SpotifySongSortable[]> {
        let items = await this.webService.procedure<SortableItemDto<SpotifySongSortableData>[]>(this.dataLoader.spotify.songsByIds.query({ ids: ids }),
        [
            {
                code: 500,
                doAction: (error?: Error) => {
                    throw new ServerError($localize`:@@spotify-error-song-generic-desc:Could not retrieve songs.`, 500, error);
                }
            }
        ]);
        return items.map(item => new SpotifySongSortable(item));
    }
}
