import { SortableItemTypes } from '@sorter/api';
import { protectedProcedure } from '../../../trpc.js';
import { SteamUserGameLoader } from '../../../domain/loaders/steam/steam-user-game-loader.js';
import { SORTABLE_ITEM_MANAGER } from '../../common.js';
import { SORTABLE_ITEMS_OUTPUT } from '../loader-models.js';
import { STEAM_USER_LIBRARY_QUERY_MODEL } from './steam-models.js';

export const steamGamesByUserLibraryQueryRoute = protectedProcedure
    .input(STEAM_USER_LIBRARY_QUERY_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const games = await SORTABLE_ITEM_MANAGER.getItemsFromSource(SortableItemTypes.SPOTIFY_SONG, () => {
            return new SteamUserGameLoader().loadItemsFromSource(input.steamVanityUrl);
        });
        return games;
    });
