export const VALID_GAME_TYPES = ['generic-items', 'anilist-character', 'anilist-staff', 'anilist-anime', 'anilist-manga'];

export interface GameOption {
    type: string
    displayName: string
    image: string
}
