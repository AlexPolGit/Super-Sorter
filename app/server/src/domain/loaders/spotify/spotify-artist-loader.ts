import { SortableItemDto } from "../../../../../lib/src/objects/sortable.js";
import { SpotifyLoader } from "./spotify-loader.js";
import { SpotifyArtistSortableData } from "../../../../../lib/src/objects/sortables/spotify-artist.js";

export interface ArtistData {
    artists: Artist[];
}

export interface Artist {
    id: string;
    name: string;
    images: ArtistImage[];
}

export interface ArtistImage {
    url: string;
    height: number;
    width: number;
}

export class SpotfiyArtistLoader extends SpotifyLoader {
    override async loadItemsFromSource(query: any): Promise<SortableItemDto<SpotifyArtistSortableData>[]> {
        return [];
    }
}
