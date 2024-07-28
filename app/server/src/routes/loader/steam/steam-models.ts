import { z } from 'zod';

export const STEAM_USER_LIBRARY_QUERY_MODEL = z.object({
    steamUser: z.string()
});

export const STEAM_GAMES_BY_ID_INPUT_MODEL = z.object({ ids: z.array(z.string()) });
