import { SortableItemDto } from "@sorter/api/src/objects/sortable.js";
import { SpotifyLoader } from "./spotify-loader.js";
import { SpotifyArtistSortableData } from "@sorter/api/src/objects/sortables/spotify-artist.js";

export class SpotfiyArtistIdLoader extends SpotifyLoader {
    override async loadItemsFromSource(idList: string[]): Promise<SortableItemDto<SpotifyArtistSortableData>[]> {
        return await this.populateArtists(idList);
    }
}
