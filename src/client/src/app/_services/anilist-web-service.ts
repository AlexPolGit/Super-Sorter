import { Injectable } from "@angular/core";
import { AnilistCharacter } from "../_objects/server/anilist/anilist-character";
import { WebService } from "./web-service";
import { AnilistFavouriteCharacterLoader } from "../_util/loaders/anilist-favourite-character-loader";
import { AnilistCharacterSortable } from "../_objects/sortables/anilist-character";
import { firstValueFrom } from "rxjs";

@Injectable({providedIn:'root'})
export class AnilistWebService extends WebService {

    async setupAnilistCharacterGame(username: string): Promise<AnilistCharacterSortable[]> {
        let characterLoader = new AnilistFavouriteCharacterLoader(username);
        let items = await characterLoader.getObjects();
        await this.addCharacters(items);
        return items;
    }

    async addCharacters(characters: AnilistCharacterSortable[]) {
        // console.log("Adding Anilist characters:", characters);

        let charactersToAdd: AnilistCharacter[] = [];
        characters.forEach((char: AnilistCharacterSortable) => {
            charactersToAdd.push(char.getCharacterData());
        });

        await firstValueFrom(this.postRequest(`anilist/characters`, {
            characters: charactersToAdd
        }));
    }

    async getCharacters(characterIds: string[]): Promise<AnilistCharacterSortable[]> {
        // console.log("Getting Anilist characters:", characterIds);

        let charList = await firstValueFrom(this.postRequest<AnilistCharacter[]>(`anilist/characters/list`, {
            ids: characterIds
        }));

        let sortables: AnilistCharacterSortable[] = [];
        charList.forEach((char: AnilistCharacter) => {
            sortables.push(AnilistCharacterSortable.fromCharacterData(char));
        });

        return sortables;
    }
}
