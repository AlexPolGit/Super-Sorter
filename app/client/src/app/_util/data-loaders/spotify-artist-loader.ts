import { BaseLoader } from "./base-loader";
import { SpotifyArtistSortable } from "src/app/_objects/sortables/spotify-artist";

export class SpotfiyArtistLoader extends BaseLoader<SpotifyArtistSortable> {
    static override identifier: string = "spotify-artist";

    override async getSortables(query: string): Promise<SpotifyArtistSortable[]> {
        return [];
    }
}
