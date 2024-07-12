export enum SortableItemTypes {
    GENERIC_ITEM = "generic-items",
    ANILIST_CHARACTER = "anilist-character",
    ANILIST_STAFF = "anilist-staff",
    ANILIST_MEDIA = "anilist-media",
    SPOTIFY_SONG = "spotify-songs"
}

export interface SortableItem {
    id: string,
    type: SortableItemTypes
    data: any
}
