import { SortableItemDto, AnilistCharacterSortableData } from "@sorter/api";
import { ServerError } from "../_objects/custom-error";
import { AnilistCharacterSortable } from "../_objects/sortables/anilist-character";
import { BaseLoader } from "./base-loader";

export class AnilistCharacterIdLoader extends BaseLoader<AnilistCharacterSortable> {
    static override identifier: string = "anilist-character-id";

    override async getSortables(ids: number[]): Promise<AnilistCharacterSortable[]> {
        let items = await this.webService.procedure<SortableItemDto<AnilistCharacterSortableData>[]>(this.dataLoader.anilist.charactersByIds.query({ ids: ids }),
        [
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
