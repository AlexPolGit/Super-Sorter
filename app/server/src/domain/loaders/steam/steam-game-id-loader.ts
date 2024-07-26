import { SortableItemDto, SteamGameSortableData } from "@sorter/api";
import { AppDetailsResponse, STEAM_GAME_QUERY_RETRIES, STEAM_GAME_QUERY_SLEEP, SteamLoader, SteamQueryException } from "./steam-loader.js";
import { HttpResponseException } from "../../../util/web.js";

export class SteamGameIdLoader extends SteamLoader {
    override async loadItemsFromSource(idList: string[]): Promise<SortableItemDto<SteamGameSortableData>[]> {
        return await this.getSteamGamesById(idList);
    }

    async getSteamGamesById(idList: string[]): Promise<SortableItemDto<SteamGameSortableData>[]> {
        let games: SortableItemDto<SteamGameSortableData>[] = [];
        for (let i = 0; i < idList.length; i++) {
            try {
                const response = await this.runSteamStoreApiQuery<AppDetailsResponse>("appdetails", [`appids=${idList[i]}`], STEAM_GAME_QUERY_RETRIES, STEAM_GAME_QUERY_SLEEP);
                const appDetails = response[`${idList[i]}`];
    
                if (appDetails.success) {
                    games.push(this.parseAppData(idList[i], appDetails.data));
                }
            }
            catch (e: any) {
                if (e instanceof HttpResponseException && e.response.status === 429) {
                    console.warn(`Got a 429 error for Steam app "${idList[i]}", trying again.`);
                    throw new SteamQueryException(e);
                }
                else {
                    throw e;
                }
            }
        }
        return games;
    }
}
