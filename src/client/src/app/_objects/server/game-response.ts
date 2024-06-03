export interface GameResponse {
    sessionId: string
    options: {
        itemA: string | null,
        itemB: string | null
    }
    result: string[] | null
}
