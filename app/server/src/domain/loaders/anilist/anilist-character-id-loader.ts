import { gql } from "graphql-request";
import { SortableItemDto } from "../../../../../lib/src/objects/sortable.js";
import { AnilistCharacterLoader, CharacterList } from "./anilist-character-loader.js";
import { AnilistCharacterSortableData } from "../../../../../lib/src/objects/sortables/anilist-character.js";

export class AnilistCharacterIdLoader extends AnilistCharacterLoader {

    override async loadItemsFromSource(idList: number[]): Promise<SortableItemDto<AnilistCharacterSortableData>[]> {
        return await this.getItemListFromIds(idList, [], 1);
    }

    protected async getItemListFromIds(idList: number[], characterList: SortableItemDto<AnilistCharacterSortableData>[], page: number): Promise<SortableItemDto<AnilistCharacterSortableData>[]> {
        let ids = JSON.stringify(idList);
        let query = gql`
        {
            Page (page: ${page}, perPage: 50) {
                characters(id_in: ${ids}) {
                    id,
                    name {
                        full,
                        native
                    },
                    image {
                        large
                    },
                    age,
                    gender,
                    favourites
                },
                pageInfo {
                  hasNextPage
                }
            }
        }`

        let result = (await this.runAnilistQuery(query)) as CharacterList;
        let chars = this.parseCharacterList(result.Page.characters);

        if (result.Page.pageInfo.hasNextPage) {
            let nextList = await this.getItemListFromIds(idList, chars, page + 1);
            let returnValue = characterList.concat(nextList);
            return returnValue;
        }
        else {
            return characterList.concat(chars);
        }
    }
}
