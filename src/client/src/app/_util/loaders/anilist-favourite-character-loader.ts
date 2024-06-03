import { gql } from "graphql-request";
import { SortableObject } from "src/app/_objects/sortables/sortable";
import { AnilistCharacterSortable } from "src/app/_objects/sortables/anilist-character";
import { AnilistLoader } from "./anilist-loader";

export interface FavoriteList {
    User: User;
}

export interface User {
    favourites: Favourites;
}

export interface Favourites {
    characters: Characters;
}

export interface Characters {
    nodes: CharacterNode[];
    pageInfo: PageInfo;
}

export interface CharacterNode {
    id: number;
    name: Name;
    image: Image;
}

export interface Image {
    large: string;
}

export interface Name {
    full: string;
    native: string;
}

export interface PageInfo {
    hasNextPage: boolean;
}

export class AnilistFavouriteCharacterLoader extends AnilistLoader {

    constructor(userName: string) {
        super();
        this.inputData = userName;
    }

    async getObjects(): Promise<AnilistCharacterSortable[]> {
        let objects = await this.getFavoriteList([], this.inputData, 0);
        return objects;
    }

    async getFavoriteList(characterList: AnilistCharacterSortable[], userName: string, page: number): Promise<AnilistCharacterSortable[]> {
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
                            }
                        },
                        pageInfo {
                            hasNextPage
                        }
                    }
                }
            }
        }`

        let result = (await this.runQuery(query)) as FavoriteList;
        let chars: AnilistCharacterSortable[] = this.parseFavoriteList(result);

        if (result.User.favourites.characters.pageInfo.hasNextPage) {
            let nextList = await this.getFavoriteList(chars, userName, page + 1);
            let returnValue = characterList.concat(nextList);
            return returnValue;
        }
        else {
            return chars;
        }
    }

    parseFavoriteList(favoriteList: FavoriteList): AnilistCharacterSortable[] {
        let characterList: AnilistCharacterSortable[] = [];
        let list: CharacterNode[] = favoriteList.User.favourites.characters.nodes;
        list.forEach((node: CharacterNode) => {
            let char = new AnilistCharacterSortable(`${node.id}`, node.image.large , node.name.full, node.name.native);
            characterList.push(char)
        });
        return characterList;
    }
}
