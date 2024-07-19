import { Injectable } from "@angular/core";
import {
    SortableItemDto,
    SortableItemTypes,
    AnilistCharacterSortableData,
    AnilistStaffSortableData,
    AnilistMediaSortableData,
    GenericSortableData,
    SpotifySongSortableData,
    SpotifyArtistSortableData
} from "@sorter/api";
import { InterfaceError } from "../_objects/custom-error";
import { WebService } from "./web-service";
import { BaseLoader } from "../_data-loaders/base-loader";
import { GenericItemLoader } from "../_data-loaders/generic-item-loader";
import { SpotfiyPlaylistSongLoader } from "../_data-loaders/spotify-playlist-song-loader";
import { SortableObject } from "../_objects/sortables/sortable";
import { AnilistCharacterFaveListLoader } from "../_data-loaders/anilist-character-fave-list-loader";
import { AnilistCharacterIdLoader } from "../_data-loaders/anilist-character-id-loader";
import { AnilistStaffFaveListLoader } from "../_data-loaders/anilist-staff-fave-list-loader";
import { AnilistStaffIdLoader } from "../_data-loaders/anilist-staff-id-loader";
import { AnilistMediaUserListLoader } from "../_data-loaders/anilist-media-user-list-loader";
import { AnilistMediaFaveListLoader } from "../_data-loaders/anilist-media-fave-list-loader";
import { AnilistMediaIdLoader } from "../_data-loaders/anilist-media-id-loader";
import { SpotfiyArtistLoader } from "../_data-loaders/spotify-artist-loader";
import { AnilistCharacterSortable } from "../_objects/sortables/anilist-character";
import { AnilistStaffSortable } from "../_objects/sortables/anilist-staff";
import { AnilistMediaSortable } from "../_objects/sortables/anilist-media";
import { GenericSortable } from "../_objects/sortables/generic-item";
import { SpotifySongSortable } from "../_objects/sortables/spotify-song";
import { SpotifyArtistSortable } from "../_objects/sortables/spotify-artist";
import { SpotfiyAlbumSongLoader } from "../_data-loaders/spotify-album-song-loader";
import { SpotifySongIdLoader } from "../_data-loaders/spotify-song-id-loader";

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
        else if (loaderIdentifier === SpotfiyAlbumSongLoader.identifier) {
            return new SpotfiyAlbumSongLoader(this.webService);
        }
        else if (loaderIdentifier === SpotfiyArtistLoader.identifier) {
            return new SpotfiyArtistLoader(this.webService);
        }
        else if (loaderIdentifier === SpotifySongIdLoader.identifier) {
            return new SpotifySongIdLoader(this.webService);
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

        return items.map(item => {
            if (type === "generic-items") {
                return new GenericSortable(item as SortableItemDto<GenericSortableData>);
            }
            else if (type === "anilist-character") {
                return new AnilistCharacterSortable(item as SortableItemDto<AnilistCharacterSortableData>);
            }
            else if (type === "anilist-staff") {
                return new AnilistStaffSortable(item as SortableItemDto<AnilistStaffSortableData>);
            }
            else if (type === "anilist-media") {
                return new AnilistMediaSortable(item as SortableItemDto<AnilistMediaSortableData>);
            }
            else if (type === "spotify-songs") {
                return new SpotifySongSortable(item as SortableItemDto<SpotifySongSortableData>);
            }
            else if (type === "spotify-artist") {
                return new SpotifyArtistSortable(item as SortableItemDto<SpotifyArtistSortableData>);
            }
            throw new InterfaceError(`Item not loaded successfully: [${item}]`);
        }) as SortableObject[];
    }
}
