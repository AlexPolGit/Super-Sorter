import { SortableItemDto, SpotifySongSortableData, SpotifyArtistSortableData } from "@sorter/api";
import { AlbumImage, SpotifyLoader, Track, TrackArtist } from "./spotify-loader.js";

interface SpotfiyAlbumData {
    tracks: {
        items: Track[];
        next?: string | null;
    };
    artists: TrackArtist[];
    images: AlbumImage[];
}

export class SpotfiyAlbumSongLoader extends SpotifyLoader {

    override async loadItemsFromSource(albumId: string): Promise<SortableItemDto<SpotifySongSortableData>[]> {
        return await this.getSongsInAlbum(albumId);
    }

    protected async getSongsInAlbum(albumId: string): Promise<SortableItemDto<SpotifySongSortableData>[]> {
        let songs: SortableItemDto<SpotifySongSortableData>[] = [];
        let trackArtists: Set<string> = new Set();
        let ablumData = await this.albumSongQuery(albumId);
        const albumImage = this.getAlbumImage(ablumData.images);

        for (const trackObj of ablumData.tracks.items) {
            let song = await this.prepareSpotifySong(trackObj, albumImage);
            songs.push(song);
            song.data.artistIds.forEach(artistId => trackArtists.add(artistId));
        }

        let allArtists: SortableItemDto<SpotifyArtistSortableData>[] = await this.populateArtists(Array.from(trackArtists));

        songs.forEach(song => {
            song.data.artists = allArtists.filter(artist => {
                return song.data.artistIds.includes(artist.id);
            });
        });

        return songs;
    }

    protected async prepareSpotifySong(track: Track, albumImage: string): Promise<SortableItemDto<SpotifySongSortableData>> {
        let artistIds: string[] = track.artists.map(trackArtist => trackArtist.id);
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

    protected async albumSongQuery(albumId: string): Promise<SpotfiyAlbumData> {
        let batches: Track[][] = [];
        let requestUrl = `albums/${albumId}?locale=en_CA&offset=0&limit=100`;
        let artists: TrackArtist[] = [];
        let images: AlbumImage[] = [];

        while (true) {
            const batch = await this.runSpotifyQuery<SpotfiyAlbumData>(requestUrl);
            batches.push(batch.tracks.items);
            if (batch.artists) {
                artists = batch.artists;
            }
            if (batch.images) {
                images = batch.images;
            }
            
            if (batch.tracks.next) {
                requestUrl = batch.tracks["next"];
            }
            else {
                break;
            }
        }

        return {
            tracks: {
                items: batches.flat()
            },
            artists: artists,
            images: images
        }
    }
}
