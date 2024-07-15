import { z } from 'zod';
import { SortableItemTypes } from '@sorter/api/src/objects/sortable.js';
import { protectedProcedure } from '../../../trpc.js';
import { GenericItemLoader } from '../../../domain/loaders/generic/generic-item-loader.js';
import { SORTABLE_ITEM_MANAGER } from '../../common.js';

export const createGenericItemsQueryRoute = protectedProcedure
    .input(z.array(z.object({ 
        name: z.string(),
        image: z.string()
    })))
    .query(async (opts) => {
        const { ctx, input } = opts;
        const characters = await new GenericItemLoader().loadItemsFromSource({
            owner: ctx.username,
            items: input
        });
        SORTABLE_ITEM_MANAGER.saveItemsToDb(characters, SortableItemTypes.GENERIC_ITEM);
        return characters;
    });
