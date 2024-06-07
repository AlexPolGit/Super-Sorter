import { firstValueFrom } from "rxjs";
import { gql } from "graphql-request";
import { AnilistLoader } from "./anilist-loader";
import { AnilistCharacterSortable } from "src/app/_objects/sortables/anilist-character";
import { AnilistCharacter } from "src/app/_objects/server/anilist/anilist-character";

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

export class AnilistFavouriteCharacterLoader extends AnilistLoader {
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

        let result = (await this.runGraphQLQuery(query)) as FavoriteList;
        let chars: AnilistCharacterSortable[] = this.parseFavoriteList(result);

        if (result.User.favourites.characters.pageInfo.hasNextPage) {
            let nextList = await this.getFavoriteList(userName, chars, page + 1);
            let returnValue = characterList.concat(nextList);
            return returnValue;
        }
        else {
            return characterList.concat(chars);
        }
    }

    parseFavoriteList(favoriteList: FavoriteList): AnilistCharacterSortable[] {
        let characterList: AnilistCharacterSortable[] = [];
        let list: CharacterNode[] = favoriteList.User.favourites.characters.nodes;
        list.forEach((node: CharacterNode) => {
            let char = new AnilistCharacterSortable(
                `${node.id}`,
                node.image.large,
                node.name.full,
                node.age,
                node.gender,
                node.favourites,
                node.name.native
            );
            characterList.push(char);
        });
        return characterList;
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

        let result = (await this.runGraphQLQuery(query)) as CharacterList;
        let chars: AnilistCharacterSortable[] = this.parseCharacterList(result);

        if (result.Page.pageInfo.hasNextPage) {
            let nextList = await this.getItemListFromIds(idList, chars, page + 1);
            let returnValue = characterList.concat(nextList);
            return returnValue;
        }
        else {
            return characterList.concat(chars);
        }
    }

    parseCharacterList(chars: CharacterList): AnilistCharacterSortable[] {
        let characterList: AnilistCharacterSortable[] = [];
        let nodes: CharacterNode[] = chars.Page.characters;
        nodes.forEach((node: CharacterNode) => {
            let char = new AnilistCharacterSortable(
                `${node.id}`,
                node.image.large,
                node.name.full,
                node.age,
                node.gender,
                node.favourites,
                node.name.native
            );
            characterList.push(char);
        });
        return characterList;
    }
}
