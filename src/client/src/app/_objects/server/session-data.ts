export interface SessionList {
    sessions: SessionData[];
}

export interface Options {
    itemA: string;
    itemB: string;
}

export interface SessionData {
    deleted: any;
    sessionId: string;
    name: string;
    type: string;
    items: string[];
    deletedItems: string[];
    history: string[];
    deletedHistory: string[];
    algorithm: string;
    seed: number;
    options?: Options;
}
