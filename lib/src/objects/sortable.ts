import { SortableObjectData } from "./sortables/sortable"

/**
 * Available sortable item types for sorting sessions.
 */
export enum SortableItemTypes {
    GENERIC_ITEM = "generic-items",
    ANILIST_CHARACTER = "anilist-character",
    ANILIST_STAFF = "anilist-staff",
    ANILIST_MEDIA = "anilist-media",
    SPOTIFY_SONG = "spotify-songs",
    SPOTIFY_ARTIST = "spotify-artist"
}

/**
 * Generic data for a sortable item.
 */
export interface SortableItemDto<Type extends SortableObjectData> {
    id: string,
    data: Type
}
