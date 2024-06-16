import { firstValueFrom } from "rxjs";
import { gql } from "graphql-request";
import { AnilistLoader } from "./anilist-loader";
import { AnilistCharacterSortable } from "src/app/_objects/sortables/anilist-character";
import { AnilistCharacter } from "src/app/_objects/server/anilist/anilist-character";
import { InterfaceError } from "src/app/_objects/custom-error";
import { SortableObject } from "src/app/_objects/sortables/sortable";

interface FavoriteList {
    User: User;
}

interface User {
    favourites: Favourites;
}

interface Favourites {
    characters: Characters;
}

interface Characters {
    nodes: CharacterNode[];
    pageInfo: PageInfo;
}

interface CharacterNode {
    id: number;
    name: Name;
    image: Image;
    age: string;
    gender: string;
    favourites: number;
}

interface Image {
    large: string;
}

interface Name {
    full: string;
    native: string;
}

interface PageInfo {
    hasNextPage: boolean;
}

interface CharacterList {
    Page: CharacterPage;
}

interface CharacterPage {
    characters: CharacterNode[];
    pageInfo: PageInfo;
}

export class AnilistCharacterLoader extends AnilistLoader {
    static override identifier: string = "anilist-character";

    async addSortablesFromListOfStrings(list: AnilistCharacterSortable[]) {

        let charactersToAdd: AnilistCharacter[] = [];
        list.forEach((char: AnilistCharacterSortable) => {
            charactersToAdd.push(char.getCharacterData());
        });

        await firstValueFrom(this.webService.postRequest(`anilist/characters`, {
            characters: charactersToAdd
        }));
    }

    async getSortablesFromListOfStrings(list: string[]): Promise<AnilistCharacterSortable[]> {

        let charList = await firstValueFrom(this.webService.postRequest<AnilistCharacter[]>(`anilist/characters/list`, {
            ids: list
        }));

        let sortables: AnilistCharacterSortable[] = [];
        charList.forEach((char: AnilistCharacter) => {
            sortables.push(AnilistCharacterSortable.fromCharacterData(char));
        });

        return sortables;
    }

    override async getFavoriteList(userName: string, characterList: AnilistCharacterSortable[], page: number): Promise<AnilistCharacterSortable[]> {
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

        let result = await this.runUsernameQuery<FavoriteList>(query);
        let chars: AnilistCharacterSortable[] = this.parseCharacterList(result.User.favourites.characters.nodes);

        if (result.User.favourites.characters.pageInfo.hasNextPage) {
            let nextList = await this.getFavoriteList(userName, chars, page + 1);
            let returnValue = characterList.concat(nextList);
            return returnValue;
        }
        else {
            return characterList.concat(chars);
        }
    }

    override async getItemListFromIds(idList: number[], characterList: AnilistCharacterSortable[], page: number): Promise<AnilistCharacterSortable[]> {
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
        let chars: AnilistCharacterSortable[] = this.parseCharacterList(result.Page.characters);

        if (result.Page.pageInfo.hasNextPage) {
            let nextList = await this.getItemListFromIds(idList, chars, page + 1);
            let returnValue = characterList.concat(nextList);
            return returnValue;
        }
        else {
            return characterList.concat(chars);
        }
    }

    parseCharacterList(nodes: CharacterNode[]): AnilistCharacterSortable[] {
        let characterList: AnilistCharacterSortable[] = [];
        nodes.forEach((node: CharacterNode) => {
            let char = new AnilistCharacterSortable(
                `${node.id}`,
                node.image.large,
                node.name.full,
                node.name.native,
                node.age,
                node.gender,
                node.favourites
            );
            characterList.push(char);
        });
        return characterList;
    }

    override getUserList(): Promise<SortableObject[]> {
        throw new InterfaceError(`"AnilistCharacterLoader" does not implement the "getUserList()" method.`);
    }
}
