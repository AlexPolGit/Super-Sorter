import { z } from 'zod';

/* Anilist Characters */
export const ANILIST_CHARACTERS_BY_FAVE_INPUT_MODEL = z.object({ username: z.string() });
export const ANILIST_CHARACTERS_BY_ID_INPUT_MODEL = z.object({ ids: z.array(z.number()) });

/* Anilist Staff */
export const ANILIST_STAFF_BY_FAVE_INPUT_MODEL = z.object({ username: z.string() });
export const ANILIST_STAFF_BY_ID_INPUT_MODEL = z.object({ ids: z.array(z.number()) });

/* Anilist Media */
export const ANILIST_MEDIA_BY_USER_INPUT_MODEL = z.object({ 
    userName: z.string(),
    statuses: z.array(z.string()),
    anime: z.boolean(),
    manga: z.boolean(),
    tagPercentMinimum: z.number()
});
export const ANILIST_MEDIA_BY_FAVE_INPUT_MODEL = z.object({ username: z.string() });
export const ANILIST_MEDIA_BY_ID_INPUT_MODEL = z.object({ ids: z.array(z.number()) });
