import { SortableItemDto, SortableItemTypes } from "../../../../../lib/src/objects/sortable";
import { SortableObject } from "./sortable";
import { SpotifyArtistSortableData } from "../../../../../lib/src/objects/sortables/spotify-artist";

export class SpotifyArtistSortable extends SortableObject {
    override type = "spotify-artist" as SortableItemTypes;
    name: string;

    constructor(dto: SortableItemDto<SpotifyArtistSortableData>) {
        super(dto);
        this.name = dto.data.name;
    }

    override getDisplayName(): string {
        return this.name;
    }

    override getLink(): string | null {
        return `https://open.spotify.com/artist/${this.id}`
    }
}
