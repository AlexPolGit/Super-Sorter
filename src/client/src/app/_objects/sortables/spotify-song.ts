import { SpotifyArtist } from "../server/spotify/spotify-artist";
import { SpotifySong } from "../server/spotify/spotify-song";
import { SortableObject } from "./sortable";
import { SpotifyArtistSortable } from "./spotify-artist";

const LOCAL_FILE_REGEX = new RegExp("^local-");
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
            return `${this.artists[0].getDisplayName()} - ${this.name}`
        }
        else {
            return this.name;
        }
    }

    override getLink(): string | null {
        let match = this.id.match(LOCAL_FILE_REGEX);
        if (match && match.length > 0) {
            return encodeURI(`https://www.youtube.com/results?search_query=${this.name}+${this.artists.map(a => a.name).join('+')}`);
        }
        else {
            return `https://open.spotify.com/track/${this.id}`;
        }
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
            preview_url: this.previewUrl,
            artistList: []
        }
    }

    static fromSongData(data: SpotifySong): SpotifySongSortable {
        return new SpotifySongSortable(
            data.id,
            data.image,
            data.name,
            data.uri,
            data.artistList.map((artist: SpotifyArtist) => SpotifyArtistSortable.fromArtistData(artist)),
            data.preview_url,
            data.artists.split(",")
        );
    }
}
