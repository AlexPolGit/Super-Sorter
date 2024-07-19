import { SortableItemDto, SpotifySongSortableData } from "@sorter/api";
import { ServerError, UserError } from "../_objects/custom-error";
import { SpotifySongSortable } from "../_objects/sortables/spotify-song";
import { BaseLoader } from "./base-loader";

export class SpotfiyPlaylistSongLoader extends BaseLoader<SpotifySongSortable> {
    static override identifier: string = "spotify-playlist-song-loader";

    override async getSortables(playlistId: string): Promise<SpotifySongSortable[]> {
        let items = await this.webService.procedure<SortableItemDto<SpotifySongSortableData>[]>(this.dataLoader.spotify.songsByPlaylist.query({ playlistId: playlistId }),
        [
            {
                code: 404,
                doAction: () => {
                    throw new UserError($localize`:@@spotify-error-playlist-does-not-exist-desc:Playlist with ID "${playlistId}:playlistId:" does not exist. Please check the ID or make sure the playlist is not private.`, $localize`:@@spotify-error-playlist-does-not-exist-title:Playlist Not Found`, 404);
                }
            },
            {
                code: 500,
                doAction: (error?: Error) => {
                    throw new ServerError($localize`:@@spotify-error-playlist-generic-desc:Could not retrieve playlist.`, 500, error);
                }
            }
        ]);
        return items.map(item => new SpotifySongSortable(item as SortableItemDto<SpotifySongSortableData>));
    }
}
