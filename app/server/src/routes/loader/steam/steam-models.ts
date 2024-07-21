import { z } from 'zod';

export const STEAM_USER_LIBRARY_QUERY_MODEL = z.object({
    steamVanityUrl: z.string()
});
