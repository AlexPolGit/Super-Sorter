import { SortableItemDto, SortableItemTypes, SteamGameSortableData } from "@sorter/api";
import { SortableItemDatabase } from "../../../database/sortable-database.js";
import { SteamLoader } from "./steam-loader.js";

export class SteamDataCrawler extends SteamLoader {
    private _sortableItemDatabase: SortableItemDatabase;

    readonly ITEM_EXPIRY = 60 * 60 * 24 * 7; // 1 week

    constructor() {
        super();
        this._sortableItemDatabase = new SortableItemDatabase();
    }

    async loadItemsFromSource(): Promise<SortableItemDto<SteamGameSortableData>[]> {
        const sortables = await this._sortableItemDatabase.getAllSortableItems(SortableItemTypes.STEAM_GAME);
        const allGames = sortables.map(row => {
            let item: SortableItemDto<SteamGameSortableData> = {
                id: row.id,
                data: JSON.parse(row.data)
            };
            return item;
        });

        let deletedItems: SortableItemDto<SteamGameSortableData>[] = [];

        for (let i = 0; i < allGames.length; i++) {
            const game = allGames[i];
            const lastUpdated = game.data.lastUpdated;
            if (lastUpdated + this.ITEM_EXPIRY < Date.now()) {
                await this._sortableItemDatabase.deleteSortableItem(game.id, SortableItemTypes.STEAM_GAME);
                deletedItems.push(game);
                console.log(`Deleting Steam game from DB: ${game.id}`);
            }
        }

        return deletedItems;
    }
}
