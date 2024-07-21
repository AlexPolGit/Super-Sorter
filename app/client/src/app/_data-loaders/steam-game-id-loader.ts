import { SortableItemDto, SteamGameSortableData } from "@sorter/api";
import { ServerError } from "../_objects/custom-error";
import { SteamGameSortable } from "../_objects/sortables/steam-game";
import { BaseLoader } from "./base-loader";


export class SteamGameIdLoader extends BaseLoader<SteamGameSortable> {
    static override identifier: string = "steam-game-id";

    override async getSortables(ids: string[]): Promise<SteamGameSortable[]> {
        let items = await this.webService.procedure<SortableItemDto<SteamGameSortableData>[]>(this.dataLoader.steam.gamesById.query({ ids: ids }),
        [
            {
                code: 500,
                doAction: (error?: Error) => {
                    throw new ServerError($localize`:@@steam-error-games-generic-desc:Could not retrieve games.`, 500, error);
                }
            }
        ]);
        return items.map(item => new SteamGameSortable(item));
    }
}
