import { SortableItemTypes } from '@sorter/api';
import { protectedProcedure } from '../../../trpc.js';
import { AnilistCharacterFaveListLoader } from '../../../domain/loaders/anilist/anilist-character-fave-list-loader.js';
import { AnilistCharacterIdLoader } from '../../../domain/loaders/anilist/anilist-character-id-loader.js';
import { AnilistStaffFaveListLoader } from '../../../domain/loaders/anilist/anilist-staff-fave-list-loader.js';
import { AnilistStaffIdLoader } from '../../../domain/loaders/anilist/anilist-staff-id-loader.js';
import { AnilistMediaFaveListLoader } from '../../../domain/loaders/anilist/anilist-media-fave-list-loader.js';
import { AnilistMediaIdLoader } from '../../../domain/loaders/anilist/anilist-media-id-loader.js';
import { AnilistMediaUserListLoader } from '../../../domain/loaders/anilist/anilist-media-user-list-loader.js';
import { SORTABLE_ITEM_MANAGER } from '../../common.js';
import { SORTABLE_ITEMS_OUTPUT } from '../loader-models.js';
import {
    ANILIST_CHARACTERS_BY_FAVE_INPUT_MODEL,
    ANILIST_CHARACTERS_BY_ID_INPUT_MODEL,
    ANILIST_STAFF_BY_FAVE_INPUT_MODEL,
    ANILIST_STAFF_BY_ID_INPUT_MODEL,
    ANILIST_MEDIA_BY_FAVE_INPUT_MODEL,
    ANILIST_MEDIA_BY_ID_INPUT_MODEL,
    ANILIST_MEDIA_BY_USER_INPUT_MODEL
} from './anilist-models.js';

/* Anilist Characters */

export const anilistCharactersByFavouritesListQueryRoute = protectedProcedure
    .input(ANILIST_CHARACTERS_BY_FAVE_INPUT_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const characters = await SORTABLE_ITEM_MANAGER.getItemsFromSource(SortableItemTypes.ANILIST_CHARACTER, () => new AnilistCharacterFaveListLoader().loadItemsFromSource(input.username));
        return characters;
    });

export const anilistCharactersByIdsQueryRoute = protectedProcedure
    .input(ANILIST_CHARACTERS_BY_ID_INPUT_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const characters = await SORTABLE_ITEM_MANAGER.getItemsFromSource(SortableItemTypes.ANILIST_CHARACTER, () => new AnilistCharacterIdLoader().loadItemsFromSource(input.ids));
        return characters;
    });



/* Anilist Staff */

export const anilistStaffByFavouritesListQueryRoute = protectedProcedure
    .input(ANILIST_STAFF_BY_FAVE_INPUT_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const staff = await SORTABLE_ITEM_MANAGER.getItemsFromSource(SortableItemTypes.ANILIST_STAFF, () => new AnilistStaffFaveListLoader().loadItemsFromSource(input.username));
        return staff;
    });

export const anilistStaffByIdsQueryRoute = protectedProcedure
    .input(ANILIST_STAFF_BY_ID_INPUT_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const staff = await SORTABLE_ITEM_MANAGER.getItemsFromSource(SortableItemTypes.ANILIST_STAFF, () => new AnilistStaffIdLoader().loadItemsFromSource(input.ids));
        return staff;
    });



/* Anilist Media */

export const anilistMediaByFavouritesListQueryRoute = protectedProcedure
    .input(ANILIST_MEDIA_BY_FAVE_INPUT_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const media = await SORTABLE_ITEM_MANAGER.getItemsFromSource(SortableItemTypes.ANILIST_MEDIA, () => new AnilistMediaFaveListLoader().loadItemsFromSource(input.username));
        return media;
    });

export const anilistMediaByIdsQueryRoute = protectedProcedure
    .input(ANILIST_MEDIA_BY_ID_INPUT_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const media = await SORTABLE_ITEM_MANAGER.getItemsFromSource(SortableItemTypes.ANILIST_MEDIA, () => new AnilistMediaIdLoader().loadItemsFromSource(input.ids));
        return media;
    });

export const anilistMediaByUserListQueryRoute = protectedProcedure
    .input(ANILIST_MEDIA_BY_USER_INPUT_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const media = await SORTABLE_ITEM_MANAGER.getItemsFromSource(
            SortableItemTypes.ANILIST_MEDIA,
            () => new AnilistMediaUserListLoader().loadItemsFromSource(input),
            // Delete user details from every item before caching.
            (items) => items.map(item => {
                delete item.data.userData;
                return item;
            }));
        return media;
    });
