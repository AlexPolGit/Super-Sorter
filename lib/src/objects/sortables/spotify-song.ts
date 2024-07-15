import { SortableItemDto } from "../sortable";
import { SortableObjectData } from "./sortable";
import { SpotifyArtistSortableData } from "./spotify-artist";

export interface SpotifySongSortableData extends SortableObjectData {
    name: string;
    artistIds: string[];
    previewUrl?: string;
    local: boolean;
    artists?: SortableItemDto<SpotifyArtistSortableData>[];
    duration?: number;
    explicit?: boolean;
}
