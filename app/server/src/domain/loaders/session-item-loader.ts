import { SortableItemDto, SortableItemTypes, SortableObjectData } from "@sorter/api";
import { BaseException } from "../exceptions/base.js";
import { SORTABLE_ITEM_MANAGER } from "../../routes/common.js";
import { AnilistCharacterIdLoader } from "./anilist/anilist-character-id-loader.js";
import { AnilistStaffIdLoader } from "./anilist/anilist-staff-id-loader.js";
import { AnilistMediaIdLoader } from "./anilist/anilist-media-id-loader.js";
import { SpotfiySongIdLoader } from "./spotify/spotify-song-id-loader.js";
import { SpotfiyArtistIdLoader } from "./spotify/spotify-artist-id-loader.js";
import { SteamGameIdLoader } from "./steam/steam-game-id-loader.js";

export class ItemCouldNotBeLoadedException extends BaseException {
    constructor(id: string) {
        super("INTERNAL_SERVER_ERROR", `The following item could not be loaded: "${id}".`);
    }
}

export class LoaderNotFoundException extends BaseException {
    constructor(type: string) {
        super("INTERNAL_SERVER_ERROR", `Loader not found: "${type}".`);
    }
}

export class SessionItemLoader {
    static async loadItemsForSession(ids: string[], type: SortableItemTypes): Promise<SortableItemDto<SortableObjectData>[]> {
        switch(type) {
            case SortableItemTypes.GENERIC_ITEM: {
                const fromDb = await SORTABLE_ITEM_MANAGER.getItemsFromDbOrCache(ids, SortableItemTypes.GENERIC_ITEM);
                return SessionItemLoader.sourceMapToList(ids, fromDb);
            }
            case SortableItemTypes.ANILIST_CHARACTER: {
                const sourceLoader = (ids: string[]) => new AnilistCharacterIdLoader().loadItemsFromSource(ids.map(id => parseInt(id)));
                const itemMap = await SORTABLE_ITEM_MANAGER.getItemsFromSourceOrCache(ids, SortableItemTypes.ANILIST_CHARACTER, sourceLoader);
                return SessionItemLoader.sourceMapToList(ids, itemMap);
            }
            case SortableItemTypes.ANILIST_STAFF: {
                const sourceLoader = (ids: string[]) => new AnilistStaffIdLoader().loadItemsFromSource(ids.map(id => parseInt(id)));
                const itemMap = await SORTABLE_ITEM_MANAGER.getItemsFromSourceOrCache(ids, SortableItemTypes.ANILIST_STAFF, sourceLoader);
                return SessionItemLoader.sourceMapToList(ids, itemMap);
            }
            case SortableItemTypes.ANILIST_MEDIA: {
                const sourceLoader = (ids: string[]) => new AnilistMediaIdLoader().loadItemsFromSource(ids.map(id => parseInt(id)));
                const itemMap = await SORTABLE_ITEM_MANAGER.getItemsFromSourceOrCache(ids, SortableItemTypes.ANILIST_MEDIA, sourceLoader);
                return SessionItemLoader.sourceMapToList(ids, itemMap);
            }
            case SortableItemTypes.SPOTIFY_SONG: {
                const nonLocalSongLoader = (ids: string[]) => new SpotfiySongIdLoader().loadItemsFromSource(ids);
                const nonLocalIds = ids.filter(id => !id.startsWith("local-"));
                const nonLocalItemMap = await SORTABLE_ITEM_MANAGER.getItemsFromSourceOrCache(ids, SortableItemTypes.SPOTIFY_SONG, nonLocalSongLoader);
                const nonLocalSongs = SessionItemLoader.sourceMapToList(nonLocalIds, nonLocalItemMap);

                const localIds = ids.filter(id => id.startsWith("local-"));
                const fromDb = await SORTABLE_ITEM_MANAGER.getItemsFromDbOrCache(localIds, SortableItemTypes.SPOTIFY_SONG);
                const localSongs = SessionItemLoader.sourceMapToList(localIds, fromDb);

                return nonLocalSongs.concat(localSongs);
            }
            case SortableItemTypes.SPOTIFY_ARTIST: {
                const nonLocalArtistLoader = (ids: string[]) => new SpotfiyArtistIdLoader().loadItemsFromSource(ids);
                const nonLocalIds = ids.filter(id => !id.startsWith("local-"));
                const nonLocalItemMap = await SORTABLE_ITEM_MANAGER.getItemsFromSourceOrCache(ids, SortableItemTypes.SPOTIFY_ARTIST, nonLocalArtistLoader);
                const nonLocalArtists = SessionItemLoader.sourceMapToList(nonLocalIds, nonLocalItemMap);

                const localIds = ids.filter(id => id.startsWith("local-"));
                const fromDb = await SORTABLE_ITEM_MANAGER.getItemsFromDbOrCache(localIds, SortableItemTypes.SPOTIFY_ARTIST);
                const localArtists = SessionItemLoader.sourceMapToList(localIds, fromDb);

                return nonLocalArtists.concat(localArtists);
            }
            case SortableItemTypes.STEAM_GAME: {
                const sourceLoader = (ids: string[]) => new SteamGameIdLoader().loadItemsFromSource(ids);
                const itemMap = await SORTABLE_ITEM_MANAGER.getItemsFromSourceOrCache(ids, SortableItemTypes.STEAM_GAME, sourceLoader);
                return SessionItemLoader.sourceMapToList(ids, itemMap);
            }
            default: {
                throw new LoaderNotFoundException(type);
            }
        }
    }

    private static sourceMapToList<DataType extends SortableObjectData>(ids: string[], fromDb: { [id: string]: SortableItemDto<SortableObjectData> | null; }) {
        return ids.map(id => {
            if (fromDb[id] === null) {
                throw new ItemCouldNotBeLoadedException(id);
            }
            else {
                return fromDb[id];
            }
        }) as SortableItemDto<DataType>[];
    }
}