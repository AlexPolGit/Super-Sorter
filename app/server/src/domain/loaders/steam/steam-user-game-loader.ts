import { SortableItemDto, SteamGameSortableData } from "@sorter/api";
import { SteamLoader, UserGame, UserGameList } from "./steam-loader.js";

export class SteamUserGameLoader extends SteamLoader {
    override async loadItemsFromSource(userId: string): Promise<SortableItemDto<SteamGameSortableData>[]> {
        return await this.getSteamGameFromUser(userId);
    }

    async getSteamGameFromUser(userId: string): Promise<SortableItemDto<SteamGameSortableData>[]> {
        const result = await this.runSteamApiQuery<UserGameList>("GetOwnedGames", [`steamid=${userId}`]);
        let userLibrary: { [id: string]: UserGame } = {};
        result.response.games.forEach(game => {
            userLibrary[game.appid] = game;
        });
        return await this.getSteamGamesFromUserLibrary(userLibrary);
    }
}
