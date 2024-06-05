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
    seed: number;
    history: string;
    deletes: string;
    options?: Options;
}
