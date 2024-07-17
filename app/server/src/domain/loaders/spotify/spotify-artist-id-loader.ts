import { SortableItemDto, SpotifyArtistSortableData } from "@sorter/api";
import { SpotifyLoader } from "./spotify-loader.js";

export class SpotfiyArtistIdLoader extends SpotifyLoader {
    override async loadItemsFromSource(idList: string[]): Promise<SortableItemDto<SpotifyArtistSortableData>[]> {
        return await this.populateArtists(idList);
    }
}
