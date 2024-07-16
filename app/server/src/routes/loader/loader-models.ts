import { z } from 'zod';

export const SORTABLE_ITEMS_OUTPUT = z.array(z.object({
    id: z.string(),
    data: z.any()
}));
