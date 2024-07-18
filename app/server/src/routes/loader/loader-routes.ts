import { SortableItemTypes } from '@sorter/api';
import { protectedProcedure } from "../../trpc.js";
import { SessionItemLoader } from '../../domain/loaders/session-item-loader.js';
import { SORTABLE_ITEMS_INPUT, SORTABLE_ITEMS_OUTPUT } from './loader-models.js';

export const getSortableItemsForSession = protectedProcedure
    .input(SORTABLE_ITEMS_INPUT)
    .output(SORTABLE_ITEMS_OUTPUT)
    .query(async (opts) => {
        const { ctx, input } = opts;
        return await SessionItemLoader.loadItemsForSession(input.ids, input.type as SortableItemTypes);
    });
