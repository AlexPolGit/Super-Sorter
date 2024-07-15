import { z } from 'zod';
import { protectedProcedure } from "../../trpc.js";
import { SORTABLE_ITEM_MANAGER } from '../common.js';
import { SortableItemTypes } from '@sorter/api/src/objects/sortable.js';

export const getSortableItemsFromDbRoute = protectedProcedure
    .input(z.object({ ids: z.array(z.string()), type: z.string() }))
    .query(async (opts) => {
        const { ctx, input } = opts;
        return await SORTABLE_ITEM_MANAGER.getItemsFromDb(input.ids, input.type as SortableItemTypes);
    });
