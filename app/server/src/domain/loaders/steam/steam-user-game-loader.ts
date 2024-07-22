import { SortableItemDto, SteamGameSortableData } from "@sorter/api";
import { SteamLoader, UserGame, UserGameList } from "./steam-loader.js";
import { isNumeric } from "../../../util/logic.js";

export class SteamUserGameLoader extends SteamLoader {
    override async loadItemsFromSource(steamUser: string): Promise<SortableItemDto<SteamGameSortableData>[]> {
        const userId = await this.extractSteamUserId(steamUser);
        return (await this.getSteamGameFromUser(userId)).filter(game => {
            return (game.data.type === "game" || game.data.type === "mod");
        });
    }

    async getSteamGameFromUser(userId: string): Promise<SortableItemDto<SteamGameSortableData>[]> {
        const result = await this.runSteamApiQuery<UserGameList>("GetOwnedGames", [
            `steamid=${userId}`,
            `include_played_free_games=true`,
            `include_appinfo=true`
        ]);
        let userLibrary: { [id: string]: UserGame } = {};
        result.response.games.forEach(game => {
            userLibrary[game.appid] = game;
        });
        return await this.getSteamGamesFromUserLibrary(userLibrary);
    }

    private async extractSteamUserId(steamUser: string) {
        if (steamUser.length === 17 && isNumeric(steamUser)) {
            return steamUser;
        }
        else {
            return await this.getSteamIdFromVanityUrl(steamUser);
        }
    }
}
