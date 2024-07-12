import { SortableItem, SortableItemTypes } from "./sortables";

export interface FullSession extends SimpleSession {
    items: string[];
    deleted_items: string[];
    history: string[];
    deleted_history: string[];
}

export interface SimpleSession extends MinSession {
    owner: string;
    name: string;
    type: SortableItemTypes;
    algorithm: string;
    seed: number;
}

export interface MinSession {
    id: string;
}

export interface UserChoice {
    itemA: string;
    itemB: string;
    choice: string;
}
