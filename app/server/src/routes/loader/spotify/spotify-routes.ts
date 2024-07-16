import { SortableItemTypes } from '@sorter/api/src/objects/sortable.js';
import { protectedProcedure } from '../../../trpc.js';
import { SpotfiyPlaylistSongLoader } from '../../../domain/loaders/spotify/spotify-playlist-song-loader.js';
import { SORTABLE_ITEM_MANAGER } from '../../common.js';
import { SORTABLE_ITEMS_OUTPUT } from '../loader-models.js';
import { SPOTIFY_PLAYLIST_QUERY_MODEL } from './spotify-models.js';

export const spotifySongsByPlaylistQueryRoute = protectedProcedure
    .input(SPOTIFY_PLAYLIST_QUERY_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const songs = await new SpotfiyPlaylistSongLoader().loadItemsFromSource(input.playlistId);
        SORTABLE_ITEM_MANAGER.saveItemsToDb(songs, SortableItemTypes.SPOTIFY_SONG);
        
        const artists = songs.map(song => song.data.artists ? song.data.artists : []).flat();

        SORTABLE_ITEM_MANAGER.saveItemsToDb(artists, SortableItemTypes.SPOTIFY_ARTIST)
        return songs;
    });
