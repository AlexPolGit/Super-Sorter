import { SortableItemTypes, AlgorithmTypes, ComparisonRequestDto, SessionInteractionDto, NewSessionDto, SimpleInteractionDto, UserChoiceDto, MinSessionDto, SimpleSessionDto, FullSessionDto } from '@sorter/api';
import { z } from 'zod';

export const NEW_SESSION_MODEL = z.object({
    name: z.string(),
    type: z.nativeEnum(SortableItemTypes),
    items: z.array(z.string()),
    algorithm: z.nativeEnum(AlgorithmTypes),
    shuffle: z.boolean()
}) satisfies z.ZodType<NewSessionDto>;

export const SESSION_INTERACTION_MODEL = z.object({
    sessionId: z.string()
}) satisfies z.ZodType<SessionInteractionDto>;

export const SIMPLE_INTERACTION_MODEL = SESSION_INTERACTION_MODEL.merge(z.object({
    item: z.string()
})) satisfies z.ZodType<SimpleInteractionDto>;

const COMPARISON_REQUEST_MODEL = z.object({
    itemA: z.string(),
    itemB: z.string()
}) satisfies z.ZodType<ComparisonRequestDto>;

export const USER_CHOICE_MODEL = SESSION_INTERACTION_MODEL.merge(z.object({
    choice: z.object({
        itemA: z.string(),
        itemB: z.string(),
        choice: z.string()
    })
})) satisfies z.ZodType<UserChoiceDto>;

export const MIN_SESSION_MODEL = SESSION_INTERACTION_MODEL.merge(z.object({
    choice: z.optional(COMPARISON_REQUEST_MODEL),
    result: z.optional(z.array(z.string())),
    progress: z.optional(z.number())
})) satisfies z.ZodType<MinSessionDto>;

export const SIMPLE_SESSION_MODEL = MIN_SESSION_MODEL.merge(z.object({
    owner: z.string(),
    name: z.string(),
    type: z.nativeEnum(SortableItemTypes),
    algorithm: z.string(),
    seed: z.number(),
    totalEstimate: z.optional(z.number())
})) satisfies z.ZodType<SimpleSessionDto>;

export const FULL_SESSION_MODEL = SIMPLE_SESSION_MODEL.merge(z.object({
    items: z.array(z.string()),
    deleted_items: z.array(z.string()),
    history: z.array(z.string()),
    deleted_history: z.array(z.string())
})) satisfies z.ZodType<FullSessionDto>;
