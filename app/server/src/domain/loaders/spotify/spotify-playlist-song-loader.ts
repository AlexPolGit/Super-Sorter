import { SortableItemDto, SpotifySongSortableData, SpotifyArtistSortableData } from "@sorter/api";
import { HttpResponseException } from "../../../util/web.js";
import { BaseException } from "../../exceptions/base.js";
import { SpotifyLoader, SpotifyQueryException, Track, TrackArtist } from "./spotify-loader.js";

export class SpotifyPlaylistNotFoundException extends BaseException {
    constructor(id: string) {
        super("NOT_FOUND", `Spotify playlist not found: "${id}".`);
    }
}

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

export class SpotfiyPlaylistSongLoader extends SpotifyLoader {

    override async loadItemsFromSource(playlistId: string): Promise<SortableItemDto<SpotifySongSortableData>[]> {
        return await this.getSongsInPlaylist(playlistId);
    }

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
            let song = await this.prepareSpotifySong(trackObj, playlistId);
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
    protected async prepareSpotifySong(trackObj: TrackObject, playlistId: string): Promise<SortableItemDto<SpotifySongSortableData>> {
        let track = trackObj.track;
        const albumImage = this.getAlbumImage(track.album.images);
        let artistIds: string[] = [];

        // If it's a local song, it will have no ID.
        // Create a unique ID that will be the same every time the current user gets this song.
        if (!track.id || track.is_local) {
            track.id = `local-${playlistId}-${track.name}`;

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
                imageUrl: albumImage,
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

    protected async playlistSongQuery(playlistId: string): Promise<SpotfiyPlaylistData> {
        let batches: TrackObject[][] = [];
        let requestUrl = `playlists/${playlistId}?fields=owner(id),tracks(next,items(track(id,name,artists(id,name),uri,is_local,preview_url,album(id,images),duration_ms,explicit)))&locale=en_CA&offset=0&limit=100`;
        let ownerId = "";

        try {
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
        }
        catch (error: any) {
            if (error instanceof HttpResponseException) {
                if (error.response.status === 404) {
                    throw new SpotifyPlaylistNotFoundException(playlistId);
                }
            }
            throw new SpotifyQueryException(error);
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
}
