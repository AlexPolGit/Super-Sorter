import { gql } from "graphql-request";
import { SortableObject } from "src/app/_objects/sortables/sortable";
import { AnilistCharacter } from "src/app/_objects/sortables/anilist-character";
import { AnilistLoader } from "./anilist-loader";
import { Injector } from "@angular/core";

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
    constructor() {
        super();
    }

    async getObjects(inputData: string): Promise<SortableObject[]> {
        let objects = await this.getFavoriteList([], inputData, 0);
        return objects;
    }

    async getFavoriteList(characterList: AnilistCharacter[], userName: string, page: number): Promise<AnilistCharacter[]> {
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
        let chars: AnilistCharacter[] = this.parseFavoriteList(result);

        if (result.User.favourites.characters.pageInfo.hasNextPage) {
            let nextList = await this.getFavoriteList(chars, userName, page + 1);
            let returnValue = characterList.concat(nextList);
            return returnValue;
        }
        else {
            return chars;
        }
    }

    parseFavoriteList(favoriteList: FavoriteList): AnilistCharacter[] {
        let characterList: AnilistCharacter[] = [];
        let list: CharacterNode[] = favoriteList.User.favourites.characters.nodes;
        list.forEach((node: CharacterNode) => {
            let char = new AnilistCharacter(`${node.id}`, node.image.large , node.name.native ? node.name.native : node.name.full);
            characterList.push(char)
        });
        return characterList;
    }
}
