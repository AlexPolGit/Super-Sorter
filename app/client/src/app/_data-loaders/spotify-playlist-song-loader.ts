import { SortableItemDto, SpotifySongSortableData } from "@sorter/api";
import { SpotifySongSortable } from "../_objects/sortables/spotify-song";
import { BaseLoader } from "./base-loader";

export class SpotfiyPlaylistSongLoader extends BaseLoader<SpotifySongSortable> {
    static override identifier: string = "spotify-playlist-song-loader";

    override async getSortables(playlistId: string): Promise<SpotifySongSortable[]> {
        let items = await this.dataLoader.spotify.songsByPlaylist.query({ playlistId: playlistId });
        return items.map(item => new SpotifySongSortable(item as SortableItemDto<SpotifySongSortableData>));
    }
}
