import { z } from 'zod';
import { protectedProcedure } from '../../../trpc.js';
import { SORTABLE_ITEM_MANAGER } from '../../common.js';
import { SortableItemTypes } from '@sorter/api/src/objects/sortable.js';
import { SpotfiyPlaylistSongLoader } from '../../../domain/loaders/spotify/spotify-playlist-song-loader.js';

export const spotifySongsByPlaylistQueryRoute = protectedProcedure
    .input(z.object({ playlistId: z.string() }))
    .query(async (opts) => {
        const { ctx, input } = opts;
        const songs = await new SpotfiyPlaylistSongLoader(ctx.username).loadItemsFromSource(input.playlistId);
        SORTABLE_ITEM_MANAGER.saveItemsToDb(songs, SortableItemTypes.SPOTIFY_SONG);
        
        const artists = songs.map(song => song.data.artists ? song.data.artists : []).flat();

        SORTABLE_ITEM_MANAGER.saveItemsToDb(artists, SortableItemTypes.SPOTIFY_ARTIST)
        return songs;
    });

export const getSpotifySongsFromDbRoute = protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async (opts) => {
        const { ctx, input } = opts;
        return await SORTABLE_ITEM_MANAGER.getItemsFromDb(input.ids, SortableItemTypes.SPOTIFY_SONG);
    });

export const getSpotifyArtistsFromDbRoute = protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async (opts) => {
        const { ctx, input } = opts;
        return await SORTABLE_ITEM_MANAGER.getItemsFromDb(input.ids, SortableItemTypes.SPOTIFY_ARTIST);
    });

