import { SpotifyArtist } from "./spotify-artist";

export interface SpotifySong {
    id: string;
    name: string;
    image: string;
    uri: string;
    artists: string;
    preview_url: string;
    artistList: SpotifyArtist[];
}
