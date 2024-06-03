export interface SessionList {
    sessions: SessionData[];
}

export interface SessionData {
    sessionId: string;
    name: string;
    type: string;
    items: string[];
    seed: number;
}
