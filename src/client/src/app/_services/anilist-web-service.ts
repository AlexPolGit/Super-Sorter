import { Injectable } from "@angular/core";
import { AnilistCharacter } from "../_objects/server/anilist/anilist-character";
import { WebService } from "./web-service";
import { AnilistFavouriteCharacterLoader } from "../_util/loaders/anilist-favourite-character-loader";
import { AnilistCharacterSortable } from "../_objects/sortables/anilist-character";
import { firstValueFrom } from "rxjs";
import { AnilistStaffSortable } from "../_objects/sortables/anilist-staff";
import { AnilistFavouriteStaffLoader } from "../_util/loaders/anilist-favourite-staff-loader";
import { AnilistStaff } from "../_objects/server/anilist/anilist-staff";

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

    async setupAnilistStaffGame(username: string): Promise<AnilistStaffSortable[]> {
        let staffLoader = new AnilistFavouriteStaffLoader(username);
        let items = await staffLoader.getObjects();
        await this.addStaff(items);
        return items;
    }

    async addStaff(staff: AnilistStaffSortable[]) {
        // console.log("Adding Anilist staff:", staff);

        let staffToAdd: AnilistStaff[] = [];
        staff.forEach((s: AnilistStaffSortable) => {
            staffToAdd.push(s.getStaffData());
        });

        await firstValueFrom(this.postRequest(`anilist/staff`, {
            staff: staffToAdd
        }));
    }

    async getStaff(staffIds: string[]): Promise<AnilistStaffSortable[]> {
        // console.log("Getting Anilist staff:", staffIds);

        let staffList = await firstValueFrom(this.postRequest<AnilistStaff[]>(`anilist/staff/list`, {
            ids: staffIds
        }));

        let sortables: AnilistStaffSortable[] = [];
        staffList.forEach((s: AnilistStaff) => {
            sortables.push(AnilistStaffSortable.fromStaffData(s));
        });

        return sortables;
    }
}
