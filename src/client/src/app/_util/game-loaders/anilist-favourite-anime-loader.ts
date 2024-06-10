import { firstValueFrom } from "rxjs";
import { gql } from "graphql-request";
import { AnilistLoader } from "./anilist-loader";
import { AnilistMediaSortable } from "src/app/_objects/sortables/anilist-media";
import { AnilistMedia } from "src/app/_objects/server/anilist/anilist-media";

interface FavoriteList {
    User: User;
}

interface User {
    favourites: Favourites;
}

interface Favourites {
    anime: Anime;
}

interface Anime {
    nodes: AnimeNode[];
    pageInfo: PageInfo;
}

interface AnimeNode {
    id: number;
    title: Title;
    coverImage: CoverImage;
    favourites: number;
    meanScore: number;
    status: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS";
    format: "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC";
    genres: string[];
}

interface CoverImage {
    large: string;
}

interface Title {
    english: string;
    romaji: string;
    native: string;
}

interface PageInfo {
    hasNextPage: boolean;
}

interface AnimeList {
    Page: MediaPage;
}

interface MediaPage {
    media: AnimeNode[];
    pageInfo: PageInfo;
}


export class AnilistFavouriteAnimeLoader extends AnilistLoader {
    static override identifier: string = "anilist-anime";

    async addSortablesFromListOfStrings(list: AnilistMediaSortable[]) {

        let animeToAdd: AnilistMedia[] = [];
        list.forEach((anime: AnilistMediaSortable) => {
            animeToAdd.push(anime.getMediaData());
        });

        await firstValueFrom(this.webService.postRequest(`anilist/anime`, {
            anime: animeToAdd
        }));
    }

    async getSortablesFromListOfStrings(list: string[]): Promise<AnilistMediaSortable[]> {

        let animeList = await firstValueFrom(this.webService.postRequest<AnilistMedia[]>(`anilist/anime/list`, {
            ids: list
        }));

        let sortables: AnilistMediaSortable[] = [];
        animeList.forEach((anime: AnilistMedia) => {
            sortables.push(AnilistMediaSortable.fromMediaData(anime));
        });

        return sortables;
    }

    override async getFavoriteList(userName: string, animeList: AnilistMediaSortable[], page: number): Promise<AnilistMediaSortable[]> {
        let query = gql`
        {
            User(name: "${userName}") {
                favourites {
                    anime(page: ${page}, perPage: 25) {
                        nodes {
                            id,
                            title {
                                english,
                                romaji,
                                native
                            },
                            coverImage {
                                large
                            },
                            format,
                            status,
                            meanScore,
                            favourites,
                            genres
                        },
                        pageInfo {
                            hasNextPage
                        }
                    }
                }
            }
        }`

        let result = (await this.runGraphQLQuery(query)) as FavoriteList;
        let anime: AnilistMediaSortable[] = this.parseFavoriteList(result);

        if (result.User.favourites.anime.pageInfo.hasNextPage) {
            let nextList = await this.getFavoriteList(userName, anime, page + 1);
            let returnValue = animeList.concat(nextList);
            return returnValue;
        }
        else {
            return animeList.concat(anime);
        }
    }

    parseFavoriteList(favoriteList: FavoriteList): AnilistMediaSortable[] {
        let animeList: AnilistMediaSortable[] = [];
        let list: AnimeNode[] = favoriteList.User.favourites.anime.nodes;
        list.forEach((node: AnimeNode) => {
            let anime = new AnilistMediaSortable(
                `${node.id}`,
                node.coverImage.large,
                node.title.romaji,
                node.title.english,
                node.title.native,
                node.favourites,
                node.meanScore,
                node.status,
                node.format,
                node.genres
            );
            animeList.push(anime);
        });
        return animeList;
    }

    override async getItemListFromIds(idList: number[], animeList: AnilistMediaSortable[], page: number): Promise<AnilistMediaSortable[]> {
        let ids = JSON.stringify(idList);
        let query = gql`
        {
            Page(page: ${page}, perPage: 50) {
                media(type: ANIME, id_in: ${ids}) {
                    id,
                    title {
                        english,
                        romaji,
                        native
                    },
                    coverImage {
                        large
                    },
                    format,
                    status,
                    meanScore,
                    favourites,
                    genres
                },
                pageInfo {
                  hasNextPage
                }
            }
        }`

        let result = (await this.runGraphQLQuery(query)) as AnimeList;
        let anime: AnilistMediaSortable[] = this.parseAnimeList(result);

        if (result.Page.pageInfo.hasNextPage) {
            let nextList = await this.getItemListFromIds(idList, anime, page + 1);
            let returnValue = animeList.concat(nextList);
            return returnValue;
        }
        else {
            return animeList.concat(anime);
        }
    }

    parseAnimeList(anime: AnimeList): AnilistMediaSortable[] {
        let animeList: AnilistMediaSortable[] = [];
        let nodes: AnimeNode[] = anime.Page.media;
        nodes.forEach((node: AnimeNode) => {
            let animeItem = new AnilistMediaSortable(
                `${node.id}`,
                node.coverImage.large,
                node.title.romaji,
                node.title.english,
                node.title.native,
                node.favourites,
                node.meanScore,
                node.status,
                node.format,
                node.genres
            );
            animeList.push(animeItem);
        });
        return animeList;
    }
}
