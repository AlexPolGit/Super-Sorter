import { SortableItemDto } from "@sorter/api/src/objects/sortable.js";
import { AnilistCharacterFaveListLoader } from "./anilist/anilist-character-fave-list-loader.js";
import { BaseLoader } from "./base-loader.js";

export async function loadData(type: string, query: any): Promise<Map<string, SortableItemDto>> {
    let loader: BaseLoader;

    switch(type) {
        case "anilist-character-fave-list-loader": {
            loader = new AnilistCharacterFaveListLoader();
            break;
        }
        default: {
            throw Error();
        }
    }

    return await loader.loadItemsFromSource(query);
}
