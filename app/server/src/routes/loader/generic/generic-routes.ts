import { SortableItemTypes } from '@sorter/api/src/objects/sortable.js';
import { protectedProcedure } from '../../../trpc.js';
import { GenericItemLoader } from '../../../domain/loaders/generic/generic-item-loader.js';
import { SORTABLE_ITEM_MANAGER } from '../../common.js';
import { SORTABLE_ITEMS_OUTPUT } from '../loader-models.js';
import { GENERIC_ITEMS_QUERY_INPUT_MODEL } from './generic-models.js';

export const createGenericItemsQueryRoute = protectedProcedure
    .input(GENERIC_ITEMS_QUERY_INPUT_MODEL)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        const characters = await new GenericItemLoader().loadItemsFromSource({
            owner: ctx.username,
            items: input
        });
        SORTABLE_ITEM_MANAGER.saveItemsToDb(characters, SortableItemTypes.GENERIC_ITEM);
        return characters;
    });
