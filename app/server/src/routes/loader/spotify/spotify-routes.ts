import { SortableItemDto, SortableItemTypes, SpotifySongSortableData } from '@sorter/api';
import { protectedProcedure } from '../../../trpc.js';
import { SpotfiyPlaylistSongLoader } from '../../../domain/loaders/spotify/spotify-playlist-song-loader.js';
import { SpotfiyAlbumSongLoader } from '../../../domain/loaders/spotify/spotify-album-song-loader.js';
import { SpotfiySongIdLoader } from '../../../domain/loaders/spotify/spotify-song-id-loader.js';
import { SpotfiyArtistIdLoader } from '../../../domain/loaders/spotify/spotify-artist-id-loader.js';
import { SORTABLE_ITEM_MANAGER } from '../../common.js';
import { SORTABLE_ITEMS_OUTPUT } from '../loader-models.js';
import { SPOTIFY_ALBUM_QUERY_MODEL, SPOTIFY_ARTISTS_BY_ID_INPUT_MODEL, SPOTIFY_PLAYLIST_QUERY_MODEL, SPOTIFY_SONGS_BY_ID_INPUT_MODEL } from './spotify-models.js';

/* Spotify Songs */

export const spotifySongsByPlaylistQueryRoute = protectedProcedure
    .input(SPOTIFY_PLAYLIST_QUERY_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const songs = await SORTABLE_ITEM_MANAGER.getItemsFromSource(SortableItemTypes.SPOTIFY_SONG, () => new SpotfiyPlaylistSongLoader().loadItemsFromSource(input.playlistId)) as SortableItemDto<SpotifySongSortableData>[];

        SORTABLE_ITEM_MANAGER.saveItemsToDb(songs.filter(song => song.id.startsWith("local")), SortableItemTypes.SPOTIFY_SONG);
        const artists = songs.map(song => song.data.artists ? song.data.artists : []).flat();
        SORTABLE_ITEM_MANAGER.saveItemsToDb(artists.filter(artist => artist.id.startsWith("local")), SortableItemTypes.SPOTIFY_ARTIST);

        return songs;
    });

export const spotifySongsByAlbumQueryRoute = protectedProcedure
    .input(SPOTIFY_ALBUM_QUERY_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const songs = await SORTABLE_ITEM_MANAGER.getItemsFromSource(SortableItemTypes.SPOTIFY_SONG, () => new SpotfiyAlbumSongLoader().loadItemsFromSource(input.albumId));
        return songs;
    });

export const spotifySongsByIdsQueryRoute = protectedProcedure
    .input(SPOTIFY_SONGS_BY_ID_INPUT_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const songs = await SORTABLE_ITEM_MANAGER.getItemsFromSource(SortableItemTypes.SPOTIFY_SONG, () => new SpotfiySongIdLoader().loadItemsFromSource(input.ids));
        return songs;
    });


/* Spotify Artists */

export const spotifyArtistsByIdsQueryRoute = protectedProcedure
    .input(SPOTIFY_ARTISTS_BY_ID_INPUT_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const artists = await SORTABLE_ITEM_MANAGER.getItemsFromSource(SortableItemTypes.SPOTIFY_SONG, () => new SpotfiyArtistIdLoader().loadItemsFromSource(input.ids));
        return artists;
    });
