export interface SessionList {
    sessions: SessionData[];
}

export interface Options {
    itemA: string;
    itemB: string;
}

export interface SessionData {
    sessionId: string;
    name: string;
    type: string;
    items: string[];
    deleted: string[];
    history: string[];
    deletedHistory: string[];
    algorithm: string;
    seed: number;
    estimate: number;
    progress: number;
    options?: Options;
    results: string[];
}

export interface UpdateSession {
    name?: string;
    items?: string[];
    deleted?: string[];
    history?: string[];
    deletedHistory?: string[];
    algorithm?: string;
    seed?: number;
}
