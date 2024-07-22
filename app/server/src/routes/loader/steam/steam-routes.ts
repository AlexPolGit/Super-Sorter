import { SortableItemTypes, SteamGameSortableData } from '@sorter/api';
import { protectedProcedure } from '../../../trpc.js';
import { SteamUserGameLoader } from '../../../domain/loaders/steam/steam-user-game-loader.js';
import { SORTABLE_ITEM_MANAGER } from '../../common.js';
import { SORTABLE_ITEMS_OUTPUT } from '../loader-models.js';
import { STEAM_GAMES_BY_ID_INPUT_MODEL, STEAM_USER_LIBRARY_QUERY_MODEL } from './steam-models.js';
import { SteamGameIdLoader } from '../../../domain/loaders/steam/steam-game-id-loader.js';

export const steamGamesByUserLibraryQueryRoute = protectedProcedure
    .input(STEAM_USER_LIBRARY_QUERY_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const games = await SORTABLE_ITEM_MANAGER.getItemsFromSource<SteamGameSortableData>(
            SortableItemTypes.STEAM_GAME,
            () => new SteamUserGameLoader().loadItemsFromSource(input.steamUser),
            // Delete user details from every item before caching.
            (items) => items.map(item => {
                delete item.data.userDetails;
                return item;
            })
        );
        return games;
    });

export const steamGamesByIdsQueryRoute = protectedProcedure
    .input(STEAM_GAMES_BY_ID_INPUT_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const songs = await SORTABLE_ITEM_MANAGER.getItemsFromSource(SortableItemTypes.STEAM_GAME, () => new SteamGameIdLoader().loadItemsFromSource(input.ids));
        return songs;
    });
