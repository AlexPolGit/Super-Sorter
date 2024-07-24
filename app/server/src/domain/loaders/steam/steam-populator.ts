import path from "path";
import { fileURLToPath } from "url";
import { SortableItemDto, SortableItemTypes, SteamGameSortableData } from "@sorter/api";
import { readJsonFile } from "../../../util/fileio.js";
import { SortableItemDatabase } from "../../../database/sortable-database.js";
import { SteamLoader, SteamQueryException } from "./steam-loader.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function populateSteamGamesOnStartup() {
    const populator = new SteamDataPopulator();
    await populator.loadItemsFromSource();
    console.log("Finished initial population of DB with Steam games.");
}

export class SteamDataPopulator extends SteamLoader {
    private _sortableItemDatabase: SortableItemDatabase;

    constructor() {
        super();
        this._sortableItemDatabase = new SortableItemDatabase();
    }

    async loadItemsFromSource(): Promise<SortableItemDto<SteamGameSortableData>[]> {
        return await this.populateDbWithSteamGames();
    }

    protected async populateDbWithSteamGames(): Promise<SortableItemDto<SteamGameSortableData>[]> {
        const topSellers = readJsonFile<string[]>(`${__dirname}/steam-top-sellers.json`);
        const existingApps = await this._sortableItemDatabase.getAllSortableItems(SortableItemTypes.STEAM_GAME);
        const appIds = topSellers.filter(topSeller => {
            if (existingApps.find(x => {
                return x.id === topSeller;
            })) {
                return false;
            }
            else {
                return true;
            }
        });

        console.log(`Will populate DB with the following Steam games:`);
        console.log(appIds);

        let loadedGames: SortableItemDto<SteamGameSortableData>[] = [];
    
        for (let i = 0; i < appIds.length; i++) {
            try {
                const steamGame = await this.getGameFromSteam(appIds[i], undefined, 10, 300000); // Wait 5 minutes.
                loadedGames.push(steamGame);
                await this.saveItemsToCache([steamGame]);
                console.log(`Added Steam game to DB: ${appIds[i]}`);
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

        return loadedGames;
    }
}
