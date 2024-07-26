import { SortableItemDto, SortableItemTypes, SteamGameSortableData } from "@sorter/api";
import { SortableItemDatabase } from "../../../database/sortable-database.js";
import { SteamLoader, SteamQueryException } from "./steam-loader.js";
import { getEnvironmentVariable } from "../../../util/env.js";

export class SteamDataCleaner extends SteamLoader {
    private _sortableItemDatabase: SortableItemDatabase;

    readonly ITEM_EXPIRY = parseInt(getEnvironmentVariable("STEAM_ITEM_EXPIRY", false, "2592000000")); // 30 days default

    constructor() {
        super();
        this._sortableItemDatabase = new SortableItemDatabase();
    }

    async loadItemsFromSource(deleteStale: boolean = false): Promise<SortableItemDto<SteamGameSortableData>[]> {
        const sortables = await this._sortableItemDatabase.getAllSortableItems(SortableItemTypes.STEAM_GAME);
        const allGames = sortables.map(row => {
            let item: SortableItemDto<SteamGameSortableData> = {
                id: row.id,
                data: JSON.parse(row.data)
            };
            return item;
        });

        if (!deleteStale) {
            let updatedItems: SortableItemDto<SteamGameSortableData>[] = [];

            for (let i = 0; i < allGames.length; i++) {
                const game = allGames[i];
                const lastUpdated = game.data.lastUpdated;
                if (Date.now() > lastUpdated + this.ITEM_EXPIRY) {
                    try {
                        const updatedItem = await this.getGameFromSteam(game.id, undefined, 10, 300000); // Wait 5 minutes if rate limited.
                        updatedItems.push(updatedItem);
                        await this.saveItemsToCache([updatedItem]);
                        console.log(`Updated Steam game in DB: ${game.id}`);
                        await new Promise(f => setTimeout(f, 2000));
                    }
                    catch (e) {
                        if (e instanceof SteamQueryException) {
                            console.error(e);
                        }
                        else {
                            throw e;
                        }
                    }
                }
            }

            return updatedItems;
        }
        else {
            let deletedItems: SortableItemDto<SteamGameSortableData>[] = [];

            for (let i = 0; i < allGames.length; i++) {
                const game = allGames[i];
                const lastUpdated = game.data.lastUpdated;
                if (Date.now() > lastUpdated + this.ITEM_EXPIRY) {
                    await this._sortableItemDatabase.deleteSortableItem(game.id, SortableItemTypes.STEAM_GAME);
                    deletedItems.push(game);
                    console.log(`Deleted Steam game from DB: ${game.id}`);
                }
            }
    
            return deletedItems;
        }
    }
}
