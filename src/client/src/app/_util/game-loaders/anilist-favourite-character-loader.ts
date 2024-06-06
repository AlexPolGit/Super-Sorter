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

interface SingleCharacter {
    Character: CharacterNode;
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

    async setupGame(startingData: string): Promise<AnilistCharacterSortable[]> {
        return await this.getFavoriteList([], startingData, 0);
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

    async getCharacter(id: string): Promise<AnilistCharacterSortable> {
        let query = gql`
        {
            Character(id: ${id}) {
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
            }
        }`

        let result = (await this.runGraphQLQuery(query)) as SingleCharacter;
        let char: AnilistCharacterSortable = this.parseSingleCharacter(result);
        return char;
    }

    parseSingleCharacter(char: SingleCharacter): AnilistCharacterSortable {
        let character = char.Character;
        return new AnilistCharacterSortable(
            `${character.id}`,
            character.image.large,
            character.name.full,
            character.age,
            character.gender,
            character.favourites,
            character.name.native
        )
    }
}
