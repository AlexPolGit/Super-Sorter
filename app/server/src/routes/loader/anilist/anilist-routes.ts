import { SortableItemTypes } from '../../../../../lib/src/objects/sortable.js';
import { protectedProcedure } from '../../../trpc.js';
import { SORTABLE_ITEM_MANAGER } from '../../common.js';
import { AnilistCharacterFaveListLoader } from '../../../domain/loaders/anilist/anilist-character-fave-list-loader.js';
import { AnilistCharacterIdLoader } from '../../../domain/loaders/anilist/anilist-character-id-loader.js';
import { AnilistStaffFaveListLoader } from '../../../domain/loaders/anilist/anilist-staff-fave-list-loader.js';
import { AnilistStaffIdLoader } from '../../../domain/loaders/anilist/anilist-staff-id-loader.js';
import { AnilistMediaFaveListLoader } from '../../../domain/loaders/anilist/anilist-media-fave-list-loader.js';
import { AnilistMediaIdLoader } from '../../../domain/loaders/anilist/anilist-media-id-loader.js';
import { AnilistMediaUserListLoader } from '../../../domain/loaders/anilist/anilist-media-user-list-loader.js';
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
        const characters = await new AnilistCharacterFaveListLoader().loadItemsFromSource(input.username);
        SORTABLE_ITEM_MANAGER.saveItemsToDb(characters, SortableItemTypes.ANILIST_CHARACTER);
        return characters;
    });

export const anilistCharactersByIdsQueryRoute = protectedProcedure
    .input(ANILIST_CHARACTERS_BY_ID_INPUT_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const characters = await new AnilistCharacterIdLoader().loadItemsFromSource(input.ids);
        SORTABLE_ITEM_MANAGER.saveItemsToDb(characters, SortableItemTypes.ANILIST_CHARACTER);
        return characters;
    });



/* Anilist Staff */

export const anilistStaffByFavouritesListQueryRoute = protectedProcedure
    .input(ANILIST_STAFF_BY_FAVE_INPUT_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const staff = await new AnilistStaffFaveListLoader().loadItemsFromSource(input.username);
        SORTABLE_ITEM_MANAGER.saveItemsToDb(staff, SortableItemTypes.ANILIST_STAFF);
        return staff;
    });

export const anilistStaffByIdsQueryRoute = protectedProcedure
    .input(ANILIST_STAFF_BY_ID_INPUT_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const staff = await new AnilistStaffIdLoader().loadItemsFromSource(input.ids);
        SORTABLE_ITEM_MANAGER.saveItemsToDb(staff, SortableItemTypes.ANILIST_STAFF);
        return staff;
    });



/* Anilist Media */

export const anilistMediaByFavouritesListQueryRoute = protectedProcedure
    .input(ANILIST_MEDIA_BY_FAVE_INPUT_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const media = await new AnilistMediaFaveListLoader().loadItemsFromSource(input.username);
        SORTABLE_ITEM_MANAGER.saveItemsToDb(media, SortableItemTypes.ANILIST_MEDIA);
        return media;
    });

export const anilistMediaByIdsQueryRoute = protectedProcedure
    .input(ANILIST_MEDIA_BY_ID_INPUT_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const media = await new AnilistMediaIdLoader().loadItemsFromSource(input.ids);
        SORTABLE_ITEM_MANAGER.saveItemsToDb(media, SortableItemTypes.ANILIST_MEDIA);
        return media;
    });

export const anilistMediaByUserListQueryRoute = protectedProcedure
    .input(ANILIST_MEDIA_BY_USER_INPUT_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const media = await new AnilistMediaUserListLoader().loadItemsFromSource(input);
        SORTABLE_ITEM_MANAGER.saveItemsToDb(media, SortableItemTypes.ANILIST_MEDIA);
        return media;
    });
