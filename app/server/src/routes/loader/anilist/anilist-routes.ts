import { z } from 'zod';
import { protectedProcedure } from '../../../trpc.js';
import { SORTABLE_ITEM_MANAGER } from '../../common.js';
import { AnilistCharacterFaveListLoader } from '../../../domain/loaders/anilist/anilist-character-fave-list-loader.js';
import { AnilistCharacterIdLoader } from '../../../domain/loaders/anilist/anilist-character-id-loader.js';
import { SortableItemTypes } from '@sorter/api/src/objects/sortable.js';
import { AnilistStaffFaveListLoader } from '../../../domain/loaders/anilist/anilist-staff-fave-list-loader.js';
import { AnilistStaffIdLoader } from '../../../domain/loaders/anilist/anilist-staff-id-loader.js';
import { AnilistMediaFaveListLoader } from '../../../domain/loaders/anilist/anilist-media-fave-list-loader.js';
import { AnilistMediaIdLoader } from '../../../domain/loaders/anilist/anilist-media-id-loader.js';
import { AnilistMediaUserListLoader } from '../../../domain/loaders/anilist/anilist-media-user-list-loader.js';

/* Anilist Characters */

export const anilistCharactersByFavouritesListQueryRoute = protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async (opts) => {
        const { ctx, input } = opts;
        const characters = await new AnilistCharacterFaveListLoader().loadItemsFromSource(input.username);
        SORTABLE_ITEM_MANAGER.saveItemsToDb(characters, SortableItemTypes.ANILIST_CHARACTER);
        return characters;
    });

export const anilistCharactersByIdsQueryRoute = protectedProcedure
    .input(z.object({ ids: z.array(z.number()) }))
    .query(async (opts) => {
        const { ctx, input } = opts;
        const characters = await new AnilistCharacterIdLoader().loadItemsFromSource(input.ids);
        SORTABLE_ITEM_MANAGER.saveItemsToDb(characters, SortableItemTypes.ANILIST_CHARACTER);
        return characters;
    });

export const getAnilistCharactersFromDbRoute = protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async (opts) => {
        const { ctx, input } = opts;
        return await SORTABLE_ITEM_MANAGER.getItemsFromDb(input.ids, SortableItemTypes.ANILIST_CHARACTER);
    });



/* Anilist Staff */

export const anilistStaffByFavouritesListQueryRoute = protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async (opts) => {
        const { ctx, input } = opts;
        const staff = await new AnilistStaffFaveListLoader().loadItemsFromSource(input.username);
        SORTABLE_ITEM_MANAGER.saveItemsToDb(staff, SortableItemTypes.ANILIST_STAFF);
        return staff;
    });

export const anilistStaffByIdsQueryRoute = protectedProcedure
    .input(z.object({ ids: z.array(z.number()) }))
    .query(async (opts) => {
        const { ctx, input } = opts;
        const staff = await new AnilistStaffIdLoader().loadItemsFromSource(input.ids);
        SORTABLE_ITEM_MANAGER.saveItemsToDb(staff, SortableItemTypes.ANILIST_STAFF);
        return staff;
    });

export const getAnilistStaffFromDbRoute = protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async (opts) => {
        const { ctx, input } = opts;
        return await SORTABLE_ITEM_MANAGER.getItemsFromDb(input.ids, SortableItemTypes.ANILIST_STAFF);
    });



/* Anilist Media */

export const anilistMediaByFavouritesListQueryRoute = protectedProcedure
    .input(z.object({ username: z.string() }))
    .query(async (opts) => {
        const { ctx, input } = opts;
        const media = await new AnilistMediaFaveListLoader().loadItemsFromSource(input.username);
        SORTABLE_ITEM_MANAGER.saveItemsToDb(media, SortableItemTypes.ANILIST_MEDIA);
        return media;
    });

export const anilistMediaByIdsQueryRoute = protectedProcedure
    .input(z.object({ ids: z.array(z.number()) }))
    .query(async (opts) => {
        const { ctx, input } = opts;
        const media = await new AnilistMediaIdLoader().loadItemsFromSource(input.ids);
        SORTABLE_ITEM_MANAGER.saveItemsToDb(media, SortableItemTypes.ANILIST_MEDIA);
        return media;
    });

export const anilistMediaByUserListQueryRoute = protectedProcedure
    .input(z.object({ 
        userName: z.string(),
        statuses: z.array(z.string()),
        anime: z.boolean(),
        manga: z.boolean(),
        tagPercentMinimum: z.number()
    }))
    .query(async (opts) => {
        const { ctx, input } = opts;
        const media = await new AnilistMediaUserListLoader().loadItemsFromSource(input);
        SORTABLE_ITEM_MANAGER.saveItemsToDb(media, SortableItemTypes.ANILIST_MEDIA);
        return media;
    });

export const getAnilistMediaFromDbRoute = protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async (opts) => {
        const { ctx, input } = opts;
        return await SORTABLE_ITEM_MANAGER.getItemsFromDb(input.ids, SortableItemTypes.ANILIST_MEDIA);
    });
