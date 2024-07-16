import { gql } from "graphql-request";
import { SortableItemDto } from "@sorter/api/src/objects/sortable.js";
import { AnilistCharacterLoader, FavoriteList } from "./anilist-character-loader.js";
import { AnilistCharacterSortableData } from "@sorter/api/src/objects/sortables/anilist-character.js";

export class AnilistCharacterFaveListLoader extends AnilistCharacterLoader {

    override async loadItemsFromSource(userName: string): Promise<SortableItemDto<AnilistCharacterSortableData>[]> {
        return await this.getFavoriteList(userName, [], 1);
    }

    protected async getFavoriteList(userName: string, characterList: SortableItemDto<AnilistCharacterSortableData>[], page: number): Promise<SortableItemDto<AnilistCharacterSortableData>[]> {
        let query = gql`
        {
            User(name: "${userName}") {
                favourites {
                    characters(page: ${page}, perPage: 25) {
                        nodes {
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
                }
            }
        }`

        let result = await this.runAnilistQuery<FavoriteList>(query);
        let chars = this.parseCharacterList(result.User.favourites.characters.nodes);

        if (result.User.favourites.characters.pageInfo.hasNextPage) {
            let nextList = await this.getFavoriteList(userName, chars, page + 1);
            let returnValue = characterList.concat(nextList);
            return returnValue;
        }
        else {
            return characterList.concat(chars);
        }
    }
}
