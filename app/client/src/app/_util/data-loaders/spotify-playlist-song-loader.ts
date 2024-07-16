import { SortableItemDto } from "../../../../../lib/src/objects/sortable";
import { SpotifySongSortableData } from "../../../../../lib/src/objects/sortables/spotify-song";
import { BaseLoader } from "./base-loader";
import { SpotifySongSortable } from "src/app/_objects/sortables/spotify-song";

export class SpotfiyPlaylistSongLoader extends BaseLoader<SpotifySongSortable> {
    static override identifier: string = "spotify-playlist-song-loader";

    override async getSortables(playlistId: string): Promise<SpotifySongSortable[]> {
        let items = await this.dataLoader.spotify.songsByPlaylist.query({ playlistId: playlistId });
        return items.map(item => new SpotifySongSortable(item as SortableItemDto<SpotifySongSortableData>));
    }
}
