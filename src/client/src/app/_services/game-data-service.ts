import { Injectable } from "@angular/core";
import { InterfaceError } from "../_objects/custom-error";
import { WebService } from "./web-service";
import { BaseLoader } from "../_util/game-loaders/base-loader";
import { GenericItemLoader } from "../_util/game-loaders/generic-item-loader";
import { AnilistCharacterLoader } from "../_util/game-loaders/anilist-character-loader";
import { AnilistStaffLoader } from "../_util/game-loaders/anilist-staff-loader";
import { AnilistMediaLoader } from "../_util/game-loaders/anilist-media-loader";
import { SpotfiyPlaylistSongLoader } from "../_util/game-loaders/spotify-playlist-song-loader";
import { SpotfiyArtistLoader } from "../_util/game-loaders/spotify-artist-loader";
import { AccountsService } from "./accounts-service";

@Injectable({providedIn:'root'})
export class GameDataService {

    constructor(
        private webService: WebService,
        private accountsService: AccountsService
    ) {}
    
    getDataLoader(loaderIdentifier: string): BaseLoader {
        if (loaderIdentifier === GenericItemLoader.identifier) {
            return new GenericItemLoader(this.webService);
        }
        else if (loaderIdentifier === AnilistCharacterLoader.identifier) {
            return new AnilistCharacterLoader(this.webService);
        }
        else if (loaderIdentifier === AnilistStaffLoader.identifier) {
            return new AnilistStaffLoader(this.webService);
        }
        else if (loaderIdentifier === AnilistMediaLoader.identifier) {
            return new AnilistMediaLoader(this.webService);
        }
        else if (loaderIdentifier === SpotfiyPlaylistSongLoader.identifier) {
            return new SpotfiyPlaylistSongLoader(
                this.webService,
                this.accountsService,
                new SpotfiyArtistLoader(this.webService, this.accountsService)
            );
        }
        else if (loaderIdentifier === SpotfiyArtistLoader.identifier) {
            return new SpotfiyArtistLoader(this.webService, this.accountsService);
        }
        else {
            throw new InterfaceError(`Game data loader not identified: ${loaderIdentifier}`);
        }
    }
}
