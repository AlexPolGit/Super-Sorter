import { gql } from "graphql-request";
import { SortableItemDto } from "@sorter/api/src/objects/sortable.js";
import { AnilistCharacterLoader, CharacterList } from "./anilist-character-loader.js";

export class AnilistCharacterIdLoader extends AnilistCharacterLoader {

    override async loadItemsFromSource(idList: number[]): Promise<Map<string, SortableItemDto>> {
        let items = await this.getItemListFromIds(idList, [], 1);
        return new Map(items.map(obj => [obj.id, obj]));
    }

    async getItemListFromIds(idList: number[], characterList: SortableItemDto[], page: number): Promise<SortableItemDto[]> {
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
        let chars: SortableItemDto[] = this.parseCharacterList(result.Page.characters);

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
