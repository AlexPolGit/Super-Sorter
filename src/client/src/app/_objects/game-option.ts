export const VALID_GAME_TYPES = ['generic-items', 'anilist-character', 'anilist-staff', 'anilist-anime', 'anilist-manga', 'spotify-songs'];

export interface GameOption {
    type: string
    displayName: string
    image: string
}
