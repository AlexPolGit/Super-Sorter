import { SortableItemDto, AnilistCharacterSortableData } from "@sorter/api";
import { AnilistCharacterSortable } from "../_objects/sortables/anilist-character";
import { BaseLoader } from "./base-loader";
import { UserError } from "../_objects/custom-error";

export class AnilistCharacterFaveListLoader extends BaseLoader<AnilistCharacterSortable> {
    static override identifier: string = "anilist-character-fave-list";

    override async getSortables(username: string): Promise<AnilistCharacterSortable[]> {
        let items = await this.webService.procedure<SortableItemDto<AnilistCharacterSortableData>[]>(this.dataLoader.anilist.charactersByFavouritesList.query({ username: username }),
        [
            {
                code: 404,
                doAction: () => {
                    throw new UserError(`Anilist user "${username}" does not exist.`, `User Does Not Exist`, 404);
                }
            }
        ]);
        return items.map(item => new AnilistCharacterSortable(item));
    }
}
