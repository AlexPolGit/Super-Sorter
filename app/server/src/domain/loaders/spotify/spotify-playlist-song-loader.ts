import { SpotifySongSortableData } from "../../../../../lib/src/objects/sortables/spotify-song.js";
import { SpotifyArtistSortableData } from "../../../../../lib/src/objects/sortables/spotify-artist.js";
import { SpotifyLoader } from "./spotify-loader.js";
import { SortableItemDto } from "../../../../../lib/src/objects/sortable.js";
import { splitArrayIntoBatches } from "../../../util/logic.js";
import { Artist, ArtistData, ArtistImage } from "./spotify-artist-loader.js";

interface SpotfiyPlaylistData {
    owner: {
        id: string;
    }
    tracks: {
        items: TrackObject[];
        next?: string | null;
    }
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
    duration_ms: number;
    explicit: boolean;
}

interface TrackArtist {
    id: string;
    name: string;
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

export class SpotfiyPlaylistSongLoader extends SpotifyLoader {

    override async loadItemsFromSource(playlistId: string): Promise<SortableItemDto<SpotifySongSortableData>[]> {
        return await this.getSongsInPlaylist(playlistId);
    }

    /**
     * TODO
     */
    protected async getSongsInPlaylist(playlistId: string): Promise<SortableItemDto<SpotifySongSortableData>[]> {
        let songs: SortableItemDto<SpotifySongSortableData>[] = [];
        let trackArtists: Set<string> = new Set();

        // Call the Spotify API with a query that will grab the songs from a given playlist.
        // Each song may have the following properties:
        //   - ID of song
        //   - name of song
        //   - uri of song
        //   - is the song local?
        //   - preview URL of song
        //   - artists for song
        //   - album for song
        //   - duration of the song
        //   - is the song explicit?
        let playlistData = await this.playlistSongQuery(playlistId);

        // For each song (track item), prepare a sortable object version of it.
        // Keep track of artist IDs since we will need them to populate the artist data further.
        for (const trackObj of playlistData.tracks.items) {
            let song = await this.prepareSpotifySong(trackObj, playlistId, playlistData.owner.id);
            songs.push(song);
            song.data.artistIds.forEach(artistId => trackArtists.add(artistId));
        }

        // Call helper function to get detailed artist data from their IDs that we got in the previous step.
        let allArtists: SortableItemDto<SpotifyArtistSortableData>[] = await this.populateArtists(Array.from(trackArtists));

        // Add detailed artist data back to the songs that had each respective artist listed.
        songs.forEach(song => {
            song.data.artists = allArtists.filter(artist => {
                return song.data.artistIds.includes(artist.id);
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
    protected async prepareSpotifySong(trackObj: TrackObject, playlistId: string, playlistOwner: string): Promise<SortableItemDto<SpotifySongSortableData>> {
        let track = trackObj.track;

        // Get image URL for the largest image.
        // If there are no images, leave the image as undefined.
        // NOTE: songs don't have their own images, so we get the album cover instead.
        let maxHeight = 0;
        let maxHeightImage: string = "";

        if (track.album.images.length > 0) {
            track.album.images.forEach((image: AlbumImage) => {
                if (image.height > maxHeight) {
                    maxHeight = image.height;
                    maxHeightImage = image.url;
                }
            });
        }

        let artistIds: string[] = [];

        // If it's a local song, it will have no ID.
        // Create a unique ID that will be the same every time the current user gets this song.
        if (!track.id || track.is_local) {
            track.id = `local-${playlistId}-${playlistOwner}-${track.name}`;

            // Local artists also need a unique ID.
            // It should have a prefix so we know explicitly that they were from local files.
            track.artists.forEach((artist: TrackArtist) => {
                artistIds.push(`local-${artist.name}`);
            });
        }
        else {
            artistIds = track.artists.map(trackArtist => trackArtist.id);
        }

        // Create sortable song object from raw data.
        // Leave artists empty for now, but populate a list of IDs for them.
        let song: SortableItemDto<SpotifySongSortableData> = {
            id: track.id,
            data: {
                imageUrl: maxHeightImage,
                name: track.name,
                artistIds: artistIds,
                previewUrl: track.preview_url ? track.preview_url : undefined,
                local: track.is_local,
                artists: [],
                duration: track.duration_ms,
                explicit: track.explicit
            }
        }
        
        return song;
    }

    /**
     * TODO
     *
     * @param artistIds - List of artist IDs.
     * @returns List of sortable objects containing artist data.
     */
    protected async populateArtists(trackArtists: string[]): Promise<SortableItemDto<SpotifyArtistSortableData>[]> {

        // Query Spotify for the non-local-file artists.
        // The local ones' details can just be made up from what info we have on them.
        let validArtistIds: string[] = [];
        let localArtistIds: string[] = [];
        trackArtists.forEach((trackArtist: string) => {
            if (trackArtist.startsWith("local-")) {
                localArtistIds.push(trackArtist);
            }
            else {
                validArtistIds.push(trackArtist);
            }
        });

        // Run query to get artists whose IDs are included in the input.
        let artistData = await this.multipleArtistQuery(validArtistIds.join(","));
        
        // For each artist found, create a SpotifyArtistSortable object.
        let artists: SortableItemDto<SpotifyArtistSortableData>[] = Array.from(artistData.artists, (artist: Artist) => {
            // Get image URL for the largest image.
            // If there are no images, leave the image as undefined.
            let maxHeight = 0;
            let maxHeightImage: string = "";

            if (artist.images.length > 0) {
                artist.images.forEach((image: ArtistImage) => {
                    if (image.height > maxHeight) {
                        maxHeight = image.height;
                        maxHeightImage = image.url;
                    }
                });
            }

            return {
                id: artist.id,
                data: {
                    name: artist.name,
                    imageUrl: maxHeightImage
                }
            }
        });

        // Create sortable artist objects out of local-file artists.
        localArtistIds.forEach((trackArtist: string) => {
            const localArtist: SortableItemDto<SpotifyArtistSortableData> = {
                id: trackArtist,
                data: {
                    name: trackArtist.split("-").slice(1).join(),
                    imageUrl: ""
                }
            }
            artists.push(localArtist);
        });

        return artists;
    }

    protected async playlistSongQuery(playlistId: string): Promise<SpotfiyPlaylistData> {
        let batches: TrackObject[][] = [];
        let requestUrl = `playlists/${playlistId}?fields=owner(id),tracks(next,items(track(id,name,artists(id,name),uri,is_local,preview_url,album(id,images),duration_ms,explicit)))&locale=en_CA&offset=0&limit=100`;
        let ownerId = "";

        while (true) {
            const batch = await this.runSpotifyQuery<SpotfiyPlaylistData>(requestUrl);
            batches.push(batch.tracks.items);
            ownerId = batch.owner.id;
            
            if (batch.tracks.next) {
                requestUrl = batch.tracks["next"];
            }
            else {
                break;
            }
        }

        return {
            owner: {
                id: ownerId
            },
            tracks: {
                items: batches.flat()
            }
        }
    }

    protected async multipleArtistQuery(idList: string): Promise<ArtistData> {
        const idBatches = splitArrayIntoBatches<string>(idList.split(","));
        let batches: Artist[][] = [];

        for (let i = 0; i < idBatches.length; i++) {
            idList = idBatches[i].join(",");
            const batch = await this.runSpotifyQuery<ArtistData>(`artists?ids=${idList}&locale=en_CA`);
            batches.push(batch.artists);
        }

        return {
            artists: batches.flat()
        }
    }
}
