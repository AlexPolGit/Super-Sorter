import { Injectable } from "@angular/core";
import { InterfaceError } from "../_objects/custom-error";
import { WebService } from "./web-service";
import { BaseLoader } from "../_util/data-loaders/base-loader";
import { GenericItemLoader } from "../_util/data-loaders/generic-item-loader";
import { SpotfiyPlaylistSongLoader } from "../_util/data-loaders/spotify-playlist-song-loader";
import { AccountsService } from "./accounts-service";
import { SortableObject } from "../_objects/sortables/sortable";
import { AnilistCharacterFaveListLoader } from "../_util/data-loaders/anilist-character-fave-list-loader";
import { AnilistCharacterIdLoader } from "../_util/data-loaders/anilist-character-id-loader";
import { AnilistStaffFaveListLoader } from "../_util/data-loaders/anilist-staff-fave-list-loader";
import { AnilistStaffIdLoader } from "../_util/data-loaders/anilist-staff-id-loader";
import { AnilistMediaUserListLoader } from "../_util/data-loaders/anilist-media-user-list-loader";
import { AnilistMediaFaveListLoader } from "../_util/data-loaders/anilist-media-fave-list-loader";
import { AnilistMediaIdLoader } from "../_util/data-loaders/anilist-media-id-loader";
import { SpotfiyArtistLoader } from "../_util/data-loaders/spotify-artist-loader";
import { SortableItemDto, SortableItemTypes } from "../../../../lib/src/objects/sortable";
import { SortableItem } from "../../../../server/src/domain/objects/sortable";
import { SortableObjectData } from "../../../../lib/src/objects/sortables/sortable";
import { AnilistCharacterSortable } from "../_objects/sortables/anilist-character";
import { AnilistCharacterSortableData } from "../../../../lib/src/objects/sortables/anilist-character";
import { AnilistStaffSortable } from "../_objects/sortables/anilist-staff";
import { AnilistStaffSortableData } from "../../../../lib/src/objects/sortables/anilist-staff";
import { AnilistMediaSortable } from "../_objects/sortables/anilist-media";
import { AnilistMediaSortableData } from "../../../../lib/src/objects/sortables/anilist-media";
import { GenericSortable } from "../_objects/sortables/generic-item";
import { GenericSortableData } from "../../../../lib/src/objects/sortables/generic-item";
import { SpotifySongSortable } from "../_objects/sortables/spotify-song";
import { SpotifyArtistSortable } from "../_objects/sortables/spotify-artist";
import { SpotifySongSortableData } from "../../../../lib/src/objects/sortables/spotify-song";
import { SpotifyArtistSortableData } from "../../../../lib/src/objects/sortables/spotify-artist";

@Injectable({providedIn:'root'})
export class GameDataService {

    constructor(private webService: WebService) {}
    
    getDataLoader(loaderIdentifier: string): BaseLoader<SortableObject> {
        if (loaderIdentifier === GenericItemLoader.identifier) {
            return new GenericItemLoader(this.webService);
        }
        else if (loaderIdentifier === AnilistCharacterFaveListLoader.identifier) {
            return new AnilistCharacterFaveListLoader(this.webService);
        }
        else if (loaderIdentifier === AnilistCharacterIdLoader.identifier) {
            return new AnilistCharacterIdLoader(this.webService);
        }
        else if (loaderIdentifier === AnilistStaffFaveListLoader.identifier) {
            return new AnilistStaffFaveListLoader(this.webService);
        }
        else if (loaderIdentifier === AnilistStaffIdLoader.identifier) {
            return new AnilistStaffIdLoader(this.webService);
        }
        else if (loaderIdentifier === AnilistMediaUserListLoader.identifier) {
            return new AnilistMediaUserListLoader(this.webService);
        }
        else if (loaderIdentifier === AnilistMediaFaveListLoader.identifier) {
            return new AnilistMediaFaveListLoader(this.webService);
        }
        else if (loaderIdentifier === AnilistMediaIdLoader.identifier) {
            return new AnilistMediaIdLoader(this.webService);
        }
        else if (loaderIdentifier === SpotfiyPlaylistSongLoader.identifier) {
            return new SpotfiyPlaylistSongLoader(this.webService);
        }
        else if (loaderIdentifier === SpotfiyArtistLoader.identifier) {
            return new SpotfiyArtistLoader(this.webService);
        }
        else {
            throw new InterfaceError(`Game data loader not identified: ${loaderIdentifier}`);
        }
    }

    factory<T extends SortableObject>(GenericRowType: { new (...parameters: any): T }, ...parameters: any[]): T {
        return new GenericRowType(...parameters);
    }

    async getSessionItems(type: SortableItemTypes, ids: string[]): Promise<SortableObject[]> {
        let items = await this.webService.server.sortable.sessionItems.query({
            type: type,
            ids: ids
        });

        return ids.map(id => {
            if (items[id] !== null) {
                if (type === "generic-items") {
                    return new GenericSortable(items[id] as SortableItemDto<GenericSortableData>);
                }
                else if (type === "anilist-character") {
                    return new AnilistCharacterSortable(items[id] as SortableItemDto<AnilistCharacterSortableData>);
                }
                else if (type === "anilist-staff") {
                    return new AnilistStaffSortable(items[id] as SortableItemDto<AnilistStaffSortableData>);
                }
                else if (type === "anilist-media") {
                    return new AnilistMediaSortable(items[id] as SortableItemDto<AnilistMediaSortableData>);
                }
                else if (type === "spotify-songs") {
                    return new SpotifySongSortable(items[id] as SortableItemDto<SpotifySongSortableData>);
                }
                else if (type === "spotify-artist") {
                    return new SpotifyArtistSortable(items[id] as SortableItemDto<SpotifyArtistSortableData>);
                }
            }
            throw new InterfaceError(`Item not loaded successfully: [${type}:${id}]`);
        }) as SortableObject[];
    }
}
