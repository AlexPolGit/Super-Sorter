import { SpotifyArtist } from "../server/spotify/spotify-artist";
import { SortableObject } from "./sortable";

export class SpotifyArtistSortable extends SortableObject {
    name: string;
    uri: string;

    constructor(id: string, imageUrl?: string, name?: string, uri?: string) {
        super(id, imageUrl ? imageUrl : undefined);
        this.name = name ? name : "";
        this.uri = uri ? uri : "";
    }

    override getDisplayName(): string {
        return this.name;
    }

    override getLink(): string | null {
        return `https://open.spotify.com/artist/${this.id}`
    }

    getArtistData(): SpotifyArtist {
        return {
            id: this.id,
            name: this.name,
            image: this.imageUrl,
            uri: this.uri
        }
    }

    static fromArtistData(data: SpotifyArtist): SpotifyArtistSortable {
        return new SpotifyArtistSortable(
            data.id,
            data.image,
            data.name,
            data.uri
        );
    }
}
