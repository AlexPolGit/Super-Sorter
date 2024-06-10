import { Injectable } from "@angular/core";
import { InterfaceError } from "../_objects/custom-error";
import { WebService } from "./web-service";
import { BaseLoader } from "../_util/game-loaders/base-loader";
import { GenericItemLoader } from "../_util/game-loaders/generic-item-loader";
import { AnilistFavouriteCharacterLoader } from "../_util/game-loaders/anilist-favourite-character-loader";
import { AnilistFavouriteStaffLoader } from "../_util/game-loaders/anilist-favourite-staff-loader";
import { AnilistFavouriteAnimeLoader } from "../_util/game-loaders/anilist-favourite-anime-loader";
import { AnilistFavouriteMangaLoader } from "../_util/game-loaders/anilist-favourite-manga-loader";
import { SpotfiyPlaylistSongLoader } from "../_util/game-loaders/spotify-playlist-song-loader";
import { SpotfiyArtistLoader } from "../_util/game-loaders/spotify-artist-loader";

@Injectable({providedIn:'root'})
export class GameDataService {

    constructor(private webService: WebService) {}
    
    getDataLoader(loaderIdentifier: string): BaseLoader {
        if (loaderIdentifier === GenericItemLoader.identifier) {
            return new GenericItemLoader(this.webService);
        }
        else if (loaderIdentifier === AnilistFavouriteCharacterLoader.identifier) {
            return new AnilistFavouriteCharacterLoader(this.webService);
        }
        else if (loaderIdentifier === AnilistFavouriteStaffLoader.identifier) {
            return new AnilistFavouriteStaffLoader(this.webService);
        }
        else if (loaderIdentifier === AnilistFavouriteAnimeLoader.identifier) {
            return new AnilistFavouriteAnimeLoader(this.webService);
        }
        else if (loaderIdentifier === AnilistFavouriteMangaLoader.identifier) {
            return new AnilistFavouriteMangaLoader(this.webService);
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
}
