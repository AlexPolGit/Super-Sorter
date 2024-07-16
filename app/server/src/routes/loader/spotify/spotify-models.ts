import { z } from 'zod';

export const SPOTIFY_PLAYLIST_QUERY_MODEL = z.object({
    playlistId: z.string()
});
