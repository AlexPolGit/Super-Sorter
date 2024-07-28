import { SortableItemDto, SteamGameSortableData } from "@sorter/api";
import { SteamLoader, SteamQueryException } from "./steam-loader.js";

export class SteamGameIdLoader extends SteamLoader {
    override async loadItemsFromSource(idList: string[]): Promise<SortableItemDto<SteamGameSortableData>[]> {
        return await this.getSteamGamesById(idList);
    }

    async getSteamGamesById(idList: string[]): Promise<SortableItemDto<SteamGameSortableData>[]> {
        const cacheResult = await this.getItemsFromCache(idList) as { [id: string]: SortableItemDto<SteamGameSortableData> | null };
        let games: SortableItemDto<SteamGameSortableData>[] = [];

        for(const id in cacheResult) {
            if (cacheResult[id] === null) {
                try {
                    const game = await this.getGameFromSteam(id);
                    games.push(game);
                    console.log(`Adding Steam game to DB: ${id}`);
                    await this.saveItemsToCache([game]);
                    await new Promise(f => setTimeout(f, 100));
                }
                catch (error) {
                    if (error instanceof SteamQueryException) {
                        console.warn(`Tried to load steam game with ID ${id}, which does not exist.`)
                    }
                }
            }
            else {
                games.push(cacheResult[id]);
            }
        }

        return games;
    }
}
