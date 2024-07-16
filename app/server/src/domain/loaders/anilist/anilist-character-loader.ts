import { AnilistLoader } from "./anilist-loader.js";
import { SortableItemDto } from "../../../../../lib/src/objects/sortable.js";
import { AnilistCharacterSortableData } from "../../../../../lib/src/objects/sortables/anilist-character.js";

export interface FavoriteList {
    User: User;
}

export interface User {
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

export interface CharacterList {
    Page: CharacterPage;
}

interface CharacterPage {
    characters: CharacterNode[];
    pageInfo: PageInfo;
}

export abstract class AnilistCharacterLoader extends AnilistLoader {
    protected parseCharacterList(nodes: CharacterNode[]): SortableItemDto<AnilistCharacterSortableData>[] {
        let characterList: SortableItemDto<AnilistCharacterSortableData>[] = [];
        nodes.forEach((node: CharacterNode) => {
            let data: AnilistCharacterSortableData = {
                name: node.name.full,
                nameNative: node.name.native,
                imageUrl: node.image.large,
                age: node.age,
                gender: node.gender,
                favourites: node.favourites
            };

            characterList.push({
                id: `${node.id}`,
                data: data
            });
        });
        return characterList;
    }
}
