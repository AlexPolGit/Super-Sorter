import { firstValueFrom } from "rxjs";
import { SpotifyLoader } from "./spotify-base";
import { SpotifySong } from "src/app/_objects/server/spotify/spotify-song";
import { SpotifyArtistSortable } from "src/app/_objects/sortables/spotify-artist";
import { SpotifyArtist } from "src/app/_objects/server/spotify/spotify-artist";

interface ArtistData {
    artists: Artist[];
}

interface Artist {
    id: string;
    name: string;
    images: AlbumImage[];
    uri: string;
}

interface AlbumImage {
    url: string;
    height: number;
    width: number;
}

export class SpotfiyArtistLoader extends SpotifyLoader {
    static override identifier: string = "spotify-artists";

    async addSortablesFromListOfStrings(list: SpotifyArtistSortable[]) {

        let artistsToAdd: SpotifyArtist[] = [];
        list.forEach((artist: SpotifyArtistSortable) => {
            artistsToAdd.push(artist.getArtistData());
        });

        await firstValueFrom(this.webService.postRequest(`spotify/artists`, {
            artists: artistsToAdd
        }));
    }

    async getSortablesFromListOfStrings(list: string[]): Promise<SpotifyArtistSortable[]> {

        let artistList = await firstValueFrom(this.webService.postRequest<SpotifySong[]>(`spotify/artists/list`, {
            ids: list
        }));

        let sortables: SpotifyArtistSortable[] = [];
        artistList.forEach((artist: SpotifyArtist) => {
            sortables.push(SpotifyArtistSortable.fromrtistData(artist));
        });

        return sortables;
    }

    async populateArtistsFromIds(artistIds: string[]): Promise<SpotifyArtistSortable[]> {
        let artistData = await firstValueFrom(this.webService.postRequest<ArtistData>("spotify/query/artists", {
            ids: artistIds.join(",")
        }));
        
        return Array.from(artistData.artists, (artist: Artist) => {
            let maxHeight = 0;
            let maxHeightImage = undefined;

            if (artist.images.length > 0) {
                artist.images.forEach((image: AlbumImage) => {
                    if (image.height > maxHeight) {
                        maxHeight = image.height;
                        maxHeightImage = image.url;
                    }
                });
            }

            return new SpotifyArtistSortable(artist.id, maxHeightImage, artist.name, artist.uri);
        });
    }
}
