import { SortableItemTypes } from '@sorter/api/src/objects/sortables.js';
import { z } from 'zod';

export const GET_SESSION_MODEL = z.object({
    sessionId: z.string()
});

export const CREATE_SESSION_MODEL = z.object({
    name: z.string(),
    type: z.nativeEnum(SortableItemTypes),
    items: z.string(),
    algorithm: z.string()
});

const SESSION_INTERACTION_MODEL = z.object({
    sessionId: z.string()
});

export const USER_CHOICE_MODEL = SESSION_INTERACTION_MODEL.merge(z.object({
    choice: z.object({
        itemA: z.string(),
        itemB: z.string(),
        choice: z.string()
    })
}));

export const SINGLE_ITEM_MODEL = SESSION_INTERACTION_MODEL.merge(z.object({
    item: z.string()
}));
