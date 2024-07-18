import { SortableItemTypes } from "./sortable";

/**
 * Available algorithm types for sorting sessions.
 */
export enum AlgorithmTypes {
    DEFAIULT = "default",
    MERGE = "merge",
    QUEUE_MERGE = "queue-merge"
}

/**
 * Data required to create a new sorting session.
 */
export interface NewSessionDto {
    name: string,
    type: SortableItemTypes,
    items: string[],
    algorithm: AlgorithmTypes,
    shuffle: boolean
}

/**
 * Data required for any interaction with a session.
 */
export interface SessionInteractionDto {
    sessionId: string;
}

/**
 * Simple interaction with one item in a session.
 * Ex: delete or undelete an item.
 * Superset of {@link SessionInteractionDto}.
 */
export interface SimpleInteractionDto extends SessionInteractionDto {
    item: string;
}

/**
 * Request a choice from the user.
 */
export interface ComparisonRequestDto {
    itemA: string;
    itemB: string;
}

/**
 * A choice that the user has made.
 */
export interface UserChoice extends ComparisonRequestDto {
    choice: string;
}

/**
 * Represents a user choice, along with the options.
 * Superset of {@link SessionInteractionDto}.
 */
export interface UserChoiceDto extends SessionInteractionDto {
    choice: UserChoice
}

/**
 * The minimum amount of data to represent a session.
 * Usually used for returning next choice/result to user.
 */
export interface MinSessionDto {
    sessionId: string;
    choice?: ComparisonRequestDto;
    result?: string[];
    progress?: number;
}

/**
 * High-level data for a session. Does not include details like items, history, etc.
 * Superset of {@link MinSession}.
 */
export interface SimpleSessionDto extends MinSessionDto {
    owner: string;
    name: string;
    type: SortableItemTypes;
    algorithm: string;
    seed: number;
    totalEstimate?: number;
}

/**
 * Full data for a session. Includes all details that can be used to recreate a session.
 * Superset of {@link SimpleSession}.
 */
export interface FullSessionDto extends SimpleSessionDto {
    items: string[];
    deleted_items: string[];
    history: string[];
    deleted_history: string[];
}
