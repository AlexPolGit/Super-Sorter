import { firstValueFrom } from "rxjs";
import { SpotifyLoader } from "./spotify-base";
import { SpotifySongSortable } from "src/app/_objects/sortables/spotify-song";
import { SpotifySong } from "src/app/_objects/server/spotify/spotify-song";
import { SpotifyArtistSortable } from "src/app/_objects/sortables/spotify-artist";
import { AccountsService, CurrentUser } from "src/app/_services/accounts-service";
import { SpotfiyArtistLoader } from "./spotify-artist-loader";
import { WebService } from "src/app/_services/web-service";

interface SpotfiyPlaylistData {
    items: TrackObject[];
}

interface TrackObject {
    track: Track;
}

interface Track {
    id: string;
    name: string;
    uri: string;
    is_local: boolean;
    artists: TrackArtist[];
    album: Album;
    preview_url: string | null;
}

interface TrackArtist {
    id: string;
}

interface Album {
    id: string;
    images: AlbumImage[];
}

interface AlbumImage {
    url: string;
    height: number;
    width: number;
}

interface ArtistData {
    artists: Artist[];
}

interface Artist {
    id: string;
    name: string;
    images: AlbumImage[];
    uri: string;
}

export class SpotfiyPlaylistSongLoader extends SpotifyLoader {
    static override identifier: string = "spotify-songs";

    constructor(
        public override webService: WebService,
        public override accountsService: AccountsService,
        private spotfiyArtistLoader: SpotfiyArtistLoader
    ) {
        super(webService, accountsService);
    }

    /**
     * Call the backend to create new entries for Spotify songs.
     * These will be used in the sorting game.
     *
     * @param list - List of sortable Spotify song items.
     */
    async addSortablesFromListOfStrings(list: SpotifySongSortable[]) {

        // For each sortable song item, create an appropriate DTO.
        let songsToAdd: SpotifySong[] = [];
        list.forEach((song: SpotifySongSortable) => {
            songsToAdd.push(song.getSongData());
        });

        // Send data to the backend so it can save it.
        await firstValueFrom(this.webService.postRequest(`spotify/songs`, {
            songs: songsToAdd
        }));
    }

    /**
     * Call the backend to get sortable song items from the backend given a list of IDs.
     *
     * @param list - List of IDs for Spotify songs.
     * @returns List of sortable Spotify song items.
     */
    async getSortablesFromListOfStrings(list: string[]): Promise<SpotifySongSortable[]> {

        // Get song data from backend.
        let songList = await firstValueFrom(this.webService.postRequest<SpotifySong[]>(`spotify/songs/list`, {
            ids: list
        }));

        // Populate list of sortable Spotify song items.
        let sortables: SpotifySongSortable[] = [];
        songList.forEach((song: SpotifySong) => {
            sortables.push(SpotifySongSortable.fromSongData(song));
        });

        return sortables;
    }

    /**
     * Call the backend's proxy to the Spotify API to get data for a given playlist.
     * Use this data to populate a list of sortable song objects.
     *
     * @param playlistId - ID of the Spotify playlist.
     * @returns List of sortable objects containing song data.
     */
    async getSongsInPlaylist(playlistId: string): Promise<SpotifySongSortable[]> {
        let songs: SpotifySongSortable[] = [];
        let artistIds: string[] = [];

        // Call the backend's Spotify API proxy with a query that will grab the songs from a given playlist
        // Each song may have the following properties:
        //   - ID of song
        //   - name of song
        //   - uri of song
        //   - is the song local?
        //   - preview URL of song
        //   - artists for song
        //   - album for song
        let playlistData = await firstValueFrom(this.webService.postRequest<SpotfiyPlaylistData>("spotify/query/playlistsongs", {
            playlistId: playlistId
        }));

        // For each song (track item), prepare a sortable object version of it.
        // Keep track of artist IDs since we will need them to populate the artist data further.
        for (const trackObj of playlistData.items) {
            let song = await this.prepareSpotifySong(trackObj);
            songs.push(song);
            artistIds = artistIds.concat(song.artistIds);
        }

        // Call helper function to get detailed artist data from their IDs that we got in the previous step.
        let allArtists: SpotifyArtistSortable[] = await this.populateArtistsFromIds(artistIds);

        // Add detailed artist data back to the songs that had each respective artist listed.
        songs.forEach((song: SpotifySongSortable) => {
            song.artists = allArtists.filter((artist: SpotifyArtistSortable) => {
                return song.artistIds.includes(artist.id);
            });
        });

        return songs;
    }

    /**
     * Helper function for converting spotify API track objects into sortable song objects.
     *
     * @param trackObj - Object representing a track (song) in Spotify's API.
     * @returns List of sortable objects containing song data.
     */
    async prepareSpotifySong(trackObj: TrackObject): Promise<SpotifySongSortable> {
        let track = trackObj.track;

        // Get image URL for the largest image.
        // If there are no images, leave the image as undefined.
        // NOTE: songs don't have their own images, so we get the album cover instead.
        let maxHeight = 0;
        let maxHeightImage = undefined;

        if (track.album.images.length > 0) {
            track.album.images.forEach((image: AlbumImage) => {
                if (image.height > maxHeight) {
                    maxHeight = image.height;
                    maxHeightImage = image.url;
                }
            });
        }

        // If it's a local song, it will have no ID.
        // Create a unique ID that will be the same every time the current user gets this song.
        if (!track.id || track.is_local) {
            let currentUser = (this.accountsService.getCurrentUser() as CurrentUser).username;
            track.id = `local-${currentUser}-${track.name}`;
        }

        // Create sortable song object from raw data.
        // Leave artists empty for now, but populate a list of IDs for them.
        let song = new SpotifySongSortable(
            track.id,
            maxHeightImage,
            track.name,
            track.uri,
            [],
            track.preview_url ? track.preview_url : undefined,
            Array.from(track.artists, artist => artist.id)
        );

        return song;
    }

    /**
     * Call the backend to get artist data for a given list of artist IDs (strings).
     * Use this data to populate a list of sortable artist objects.
     *
     * @param artistIds - List of artist IDs.
     * @returns List of sortable objects containing artist data.
     */
    async populateArtistsFromIds(artistIds: string[]): Promise<SpotifyArtistSortable[]> {
        // Run query to get artists whose IDs are included in the input.
        let artistData = await firstValueFrom(this.webService.postRequest<ArtistData>("spotify/query/artists", {
            ids: artistIds.join(",")
        }));
        
        // For each artist found, create a SpotifyArtistSortable object.
        let artists = Array.from(artistData.artists, (artist: Artist) => {
            // If the artist is null/undefined, ignore them.
            if (!artist) {
                return null;
            }

            // Get image URL for the largest image.
            // If there are no images, leave the image as undefined.
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

        // Filter artists that had no data (set to null above).
        artists = artists.filter((artist: SpotifyArtistSortable | null) => {
            return artist !== null;
        });

        await this.spotfiyArtistLoader.addSortablesFromListOfStrings(artists as SpotifyArtistSortable[]);

        return artists as SpotifyArtistSortable[];
    }
}
