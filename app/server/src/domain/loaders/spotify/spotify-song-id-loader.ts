import { SpotifySongSortableData } from "@sorter/api/src/objects/sortables/spotify-song.js";
import { SpotifyArtistSortableData } from "@sorter/api/src/objects/sortables/spotify-artist.js";
import { AlbumImage, SpotifyLoader, Track } from "./spotify-loader.js";
import { SortableItemDto } from "@sorter/api/src/objects/sortable.js";
import { splitArrayIntoBatches } from "../../../util/logic.js";

interface SpotfiyTracksData {
    tracks: Track[];
}

export class SpotfiySongIdLoader extends SpotifyLoader {

    override async loadItemsFromSource(idList: string[]): Promise<SortableItemDto<SpotifySongSortableData>[]> {
        return await this.getSongsById(idList);
    }

    /**
     * TODO
     */
    protected async getSongsById(idList: string[]): Promise<SortableItemDto<SpotifySongSortableData>[]> {
        let songs: SortableItemDto<SpotifySongSortableData>[] = [];
        let trackArtists: Set<string> = new Set();

        let trackData = await this.multipleTrackQuery(idList);

        // ...
        for (const trackObj of trackData.tracks) {
            let song = await this.prepareSpotifySong(trackObj);
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
     * TODO
     */
    protected async prepareSpotifySong(track: Track): Promise<SortableItemDto<SpotifySongSortableData>> {

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

        if (track.id && !track.is_local) {
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

    protected async multipleTrackQuery(ids: string[]): Promise<SpotfiyTracksData> {
        const idBatches = splitArrayIntoBatches<string>(ids.filter(id => !id.startsWith("local")));
        let batches: Track[][] = [];

        for (let i = 0; i < idBatches.length; i++) {
            const idList = idBatches[i].join(",");
            const batch = await this.runSpotifyQuery<SpotfiyTracksData>(`tracks?ids=${idList}&locale=en_CA`);
            batches.push(batch.tracks);
        }

        return {
            tracks: batches.flat()
        }
    }
}
