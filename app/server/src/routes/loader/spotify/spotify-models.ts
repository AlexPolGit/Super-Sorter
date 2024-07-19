import { z } from 'zod';

export const SPOTIFY_PLAYLIST_QUERY_MODEL = z.object({
    playlistId: z.string()
});

export const SPOTIFY_ALBUM_QUERY_MODEL = z.object({
    albumId: z.string()
});

export const SPOTIFY_SONGS_BY_ID_INPUT_MODEL = z.object({ ids: z.array(z.string()) });

export const SPOTIFY_ARTISTS_BY_ID_INPUT_MODEL = z.object({ ids: z.array(z.string()) });
