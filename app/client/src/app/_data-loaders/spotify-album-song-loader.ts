import { SortableItemDto, SpotifySongSortableData } from "@sorter/api";
import { ServerError, UserError } from "../_objects/custom-error";
import { SpotifySongSortable } from "../_objects/sortables/spotify-song";
import { BaseLoader } from "./base-loader";

export class SpotfiyAlbumSongLoader extends BaseLoader<SpotifySongSortable> {
    static override identifier: string = "spotify-album-song-loader";

    override async getSortables(albumId: string): Promise<SpotifySongSortable[]> {
        let items = await this.webService.procedure<SortableItemDto<SpotifySongSortableData>[]>(this.dataLoader.spotify.songsByAlbum.query({ albumId: albumId }),
        [
            {
                code: 404,
                doAction: () => {
                    throw new UserError($localize`:@@spotify-error-album-does-not-exist-desc:Album with ID "${albumId}:albumId:" does not exist. Please check the ID.`, $localize`:@@spotify-error-album-does-not-exist-title:Album Not Found`, 404);
                }
            },
            {
                code: 500,
                doAction: (error?: Error) => {
                    throw new ServerError($localize`:@@spotify-error-album-generic-desc:Could not retrieve album.`, 500, error);
                }
            }
        ]);
        return items.map(item => new SpotifySongSortable(item as SortableItemDto<SpotifySongSortableData>));
    }
}
