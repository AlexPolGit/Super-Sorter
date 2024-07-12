import { z } from 'zod';

export const LOGIN_MODEL = z.object({
    username: z.string(),
    password: z.string()
});

export const LOGIN_RESULT = z.object({
    username: z.string()
});

export const GOOGLE_LOGIN_MODEL = z.object({
    token: z.string()
});

export const GOOGLE_LOGIN_RESULT = z.object({
    sessionSecret: z.string()
});
