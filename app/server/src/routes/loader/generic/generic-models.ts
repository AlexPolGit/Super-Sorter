import { z } from 'zod';

export const GENERIC_ITEMS_QUERY_INPUT_MODEL = z.array(z.object({ 
    name: z.string(),
    image: z.string()
}));
