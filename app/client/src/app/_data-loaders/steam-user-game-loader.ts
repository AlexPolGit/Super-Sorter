import { SortableItemDto, SteamGameSortableData } from "@sorter/api";
import { ServerError, UserError } from "../_objects/custom-error";
import { SteamGameSortable } from "../_objects/sortables/steam-game";
import { BaseLoader } from "./base-loader";

export class SteamUserGameLoader extends BaseLoader<SteamGameSortable> {
    static override identifier: string = "steam-user-game-loader";

    override async getSortables(steamUser: string): Promise<SteamGameSortable[]> {
        let items = await this.webService.procedure<SortableItemDto<SteamGameSortableData>[]>(this.dataLoader.steam.gamesByUserLibrary.query({ steamUser: steamUser }),
        [
            {
                code: 404,
                doAction: () => {
                    throw new UserError($localize`:@@steam-error-user-does-not-exist-desc:Steam user "${steamUser}:steamUser:" does not exist.`, $localize`:@@steam-error-user-does-not-exist-title:Steam User Not Found`, 404);
                }
            },
            {
                code: 500,
                doAction: (error?: Error) => {
                    throw new ServerError($localize`:@@steam-error-games-generic-desc:Could not retrieve games.`, 500, error);
                }
            }
        ]);
        return items.map(item => new SteamGameSortable(item as SortableItemDto<SteamGameSortableData>));
    }
}
