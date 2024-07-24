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

    protected async getSteamGamesFromUserLibrary(userLibrary: { [id: string]: UserGame }): Promise<SortableItemDto<SteamGameSortableData>[]> {
        const cacheResult = await this.getItemsFromCache(Object.keys(userLibrary)) as { [id: string]: SortableItemDto<SteamGameSortableData> | null };
        let games: SortableItemDto<SteamGameSortableData>[] = [];

        for(const id in cacheResult) {
            if (cacheResult[id] === null) {
                const game = await this.getGameFromSteam(id, userLibrary);
                games.push(game);
                console.log(`Adding Steam game to DB: ${id}`);
                await this.saveItemsToCache([game]);
                await new Promise(f => setTimeout(f, 200));
            }
            else {
                games.push(cacheResult[id]);
            }
        }

        return games;
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
