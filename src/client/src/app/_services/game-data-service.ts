import { Injectable } from "@angular/core";
import { BaseLoader } from "../_util/game-loaders/base-loader";
import { WebService } from "./web-service";
import { AnilistFavouriteCharacterLoader } from "../_util/game-loaders/anilist-favourite-character-loader";
import { AnilistFavouriteStaffLoader } from "../_util/game-loaders/anilist-favourite-staff-loader";
import { InterfaceError } from "../_objects/custom-error";

@Injectable({providedIn:'root'})
export class GameDataService {

    constructor(private webService: WebService) {}
    
    getDataLoader(loaderIdentifier: string): BaseLoader {
        if (loaderIdentifier === AnilistFavouriteCharacterLoader.identifier) {
            return new AnilistFavouriteCharacterLoader(this.webService);
        }
        else if (loaderIdentifier === AnilistFavouriteCharacterLoader.identifier) {
            return new AnilistFavouriteStaffLoader(this.webService);
        }
        else {
            throw new InterfaceError(`Game data loader not identified: ${loaderIdentifier}`);
        }
    }
}
