import { SpotifySong } from "../server/spotify/spotify-song";
import { SortableObject } from "./sortable";
import { SpotifyArtistSortable } from "./spotify-artist";

const MISSING_SONG_IMAGE_DEFAULT = "assets/spotify-empty-song.jpg";

export class SpotifySongSortable extends SortableObject {
    name: string;
    uri: string;
    artists: SpotifyArtistSortable[];
    artistIds: string[];
    previewUrl: string;

    constructor(id: string, imageUrl?: string, name?: string, uri?: string, artists?: SpotifyArtistSortable[], previewUrl?: string, artistIds?: string[]) {
        super(id, imageUrl ? imageUrl : MISSING_SONG_IMAGE_DEFAULT);
        this.name = name ? name : "";
        this.uri = uri ? uri : "";
        this.artists = artists ? artists : [];
        this.previewUrl = previewUrl ? previewUrl : "";
        this.artistIds = artistIds ? artistIds : [];
    }

    override getDisplayName(): string {
        if (this.artists.length > 0) {
            return `[${this.artists[0].getDisplayName()}] ${this.name}`
        }
        else {
            return this.name;
        }
    }

    override getLink(): string | null {
        return `https://open.spotify.com/track/${this.id}`
    }

    override getAudio(): string | null {
        return this.previewUrl;
    }

    getSongData(): SpotifySong {
        return {
            id: this.id,
            name: this.name,
            image: this.imageUrl,
            uri: this.uri,
            artists: this.artistIds.join(","),
            previewUrl: this.previewUrl
        }
    }

    static fromSongData(data: SpotifySong): SpotifySongSortable {
        let song = new SpotifySongSortable(
            data.id,
            data.image,
            data.name,
            data.uri,
            [],
            data.previewUrl
        );
        song.artistIds = data.artists.split(",");
        return song;
    }
}
