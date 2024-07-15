import { z } from 'zod';
import { protectedProcedure } from '../../../trpc.js';
import { SORTABLE_ITEM_MANAGER } from '../../common.js';
import { SortableItemTypes } from '@sorter/api/src/objects/sortable.js';
import { SpotfiyPlaylistSongLoader } from '../../../domain/loaders/spotify/spotify-playlist-song-loader.js';

export const spotifySongsByPlaylistQueryRoute = protectedProcedure
    .input(z.object({ playlistId: z.string() }))
    .query(async (opts) => {
        const { ctx, input } = opts;
        const songs = await new SpotfiyPlaylistSongLoader().loadItemsFromSource(input.playlistId);
        SORTABLE_ITEM_MANAGER.saveItemsToDb(songs, SortableItemTypes.SPOTIFY_SONG);
        
        const artists = songs.map(song => song.data.artists ? song.data.artists : []).flat();

        SORTABLE_ITEM_MANAGER.saveItemsToDb(artists, SortableItemTypes.SPOTIFY_ARTIST)
        return songs;
    });
