import { firstValueFrom } from "rxjs";
import { SpotifyLoader } from "./spotify-base";
import { SpotifySongSortable } from "src/app/_objects/sortables/spotify-song";
import { SpotifySong } from "src/app/_objects/server/spotify/spotify-song";
import { InterfaceError } from "src/app/_objects/custom-error";
import { SpotifyArtistSortable } from "src/app/_objects/sortables/spotify-artist";

interface SpotfiyPlaylistData {
    tracks: TrackItems;
}

interface TrackItems {
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

    async addSortablesFromListOfStrings(list: SpotifySongSortable[]) {

        let songsToAdd: SpotifySong[] = [];
        list.forEach((song: SpotifySongSortable) => {
            songsToAdd.push(song.getSongData());
        });

        await firstValueFrom(this.webService.postRequest(`spotify/songs`, {
            songs: songsToAdd
        }));
    }

    async getSortablesFromListOfStrings(list: string[]): Promise<SpotifySongSortable[]> {

        let songList = await firstValueFrom(this.webService.postRequest<SpotifySong[]>(`spotify/songs/list`, {
            ids: list
        }));

        let sortables: SpotifySongSortable[] = [];
        songList.forEach((song: SpotifySong) => {
            sortables.push(SpotifySongSortable.fromSongData(song));
        });

        return sortables;
    }

    async getSongsInPlaylist(playlistId: string): Promise<SpotifySongSortable[]> {
        let songs: SpotifySongSortable[] = [];
        let artistIds: string[] = [];

        let playlistData = await firstValueFrom(this.webService.postRequest<SpotfiyPlaylistData>("spotify/query/playlistsongs", {
            playlistId: playlistId,
            query: "tracks.items(track(id,name,artists(id),uri,is_local,preview_url,album(id,images)))"
        }));

        for (const trackObj of playlistData.tracks.items) {
            let song = await this.prepareSpotifySong(trackObj);
            songs.push(song);
            artistIds = artistIds.concat(song.artistIds);
        }

        let allArtists: SpotifyArtistSortable[] = await this.populateArtistsFromIds(artistIds);

        songs.forEach((song: SpotifySongSortable) => {
            song.artists = allArtists.filter((artist: SpotifyArtistSortable) => {
                return song.artistIds.includes(artist.id);
            });
        });

        return songs;
    }

    async prepareSpotifySong(trackObj: TrackObject): Promise<SpotifySongSortable> {
        let track = trackObj.track;
        let maxHeight = 0;
        let maxHeightImage = null;

        track.album.images.forEach((image: AlbumImage) => {
            if (image.height > maxHeight) {
                maxHeight = image.height;
                maxHeightImage = image.url;
            }
        });

        if (maxHeightImage === null) {
            throw new InterfaceError(`Could not find any images for song "${track.id}".`, "Spotify Data Load Error");
        }

        let song = new SpotifySongSortable(
            track.id,
            maxHeightImage,
            track.name,
            track.uri,
            [],
            track.preview_url ? track.preview_url : undefined
        );
        song.artistIds = Array.from(track.artists, artist => artist.id);
        return song;
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
