import { SortableItemDto, AnilistCharacterSortableData } from "@sorter/api";
import { ServerError, UserError } from "../_objects/custom-error";
import { AnilistCharacterSortable } from "../_objects/sortables/anilist-character";
import { BaseLoader } from "./base-loader";

export class AnilistCharacterFaveListLoader extends BaseLoader<AnilistCharacterSortable> {
    static override identifier: string = "anilist-character-fave-list";

    override async getSortables(username: string): Promise<AnilistCharacterSortable[]> {
        let items = await this.webService.procedure<SortableItemDto<AnilistCharacterSortableData>[]>(this.dataLoader.anilist.charactersByFavouritesList.query({ username: username }),
        [
            {
                code: 404,
                doAction: () => {
                    throw new UserError($localize`:@@anilist-error-user-does-not-exist-desc:Anilist user "${username}:username:" does not exist.`, $localize`:@@anilist-error-user-does-not-exist-title:User Does Not Exist`, 404);
                }
            },
            {
                code: 500,
                doAction: (error?: Error) => {
                    throw new ServerError($localize`:@@anilist-error-character-generic-title:Anilist character query failed.`, 500, error);
                }
            }
        ]);
        return items.map(item => new AnilistCharacterSortable(item));
    }
}
