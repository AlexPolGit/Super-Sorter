import { SortableItemDto } from "../../../../lib/src/objects/sortable.js";
import { AnilistCharacterFaveListLoader } from "./anilist/anilist-character-fave-list-loader.js";
import { BaseLoader } from "./base-loader.js";
import { AnilistCharacterIdLoader } from "./anilist/anilist-character-id-loader.js";
import { AnilistStaffIdLoader } from "./anilist/anilist-staff-id-loader.js";

export type SortableItemIdLoader = 
    "anilist-character-id-loader" |
    "anilist-staff-id-loader";

export type SortableItemLoader = SortableItemIdLoader |
    "anilist-character-fave-list-loader" |
    "anilist-staff-fave-list-loader";

export async function loadSortableItemDataByIds(type: SortableItemIdLoader, ids: string[]): Promise<SortableItemDto[]> {
    let loader: BaseLoader;

    switch(type) {
        case "anilist-character-id-loader": {
            loader = new AnilistCharacterIdLoader();
            break;
        }
        case "anilist-staff-id-loader": {
            loader = new AnilistStaffIdLoader();
            break;
        }
        default: {
            throw Error();
        }
    }

    return await loader.loadItemsFromSource(ids);
}
