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
    manga: Manga;
}

interface Manga {
    nodes: MangaNode[];
    pageInfo: PageInfo;
}

interface MangaNode {
    id: number;
    title: Title;
    coverImage: CoverImage;
    favourites: number;
    meanScore: number;
    status: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS";
    format: "MANGA" | "NOVEL" | "ONE_SHOT";
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

interface MangaList {
    Page: MediaPage;
}

interface MediaPage {
    media: MangaNode[];
    pageInfo: PageInfo;
}


export class AnilistFavouriteMangaLoader extends AnilistLoader {
    static override identifier: string = "anilist-manga";

    async addSortablesFromListOfStrings(list: AnilistMediaSortable[]) {

        let mangaToAdd: AnilistMedia[] = [];
        list.forEach((manga: AnilistMediaSortable) => {
            mangaToAdd.push(manga.getMediaData());
        });

        await firstValueFrom(this.webService.postRequest(`anilist/manga`, {
            manga: mangaToAdd
        }));
    }

    async getSortablesFromListOfStrings(list: string[]): Promise<AnilistMediaSortable[]> {

        let mangaList = await firstValueFrom(this.webService.postRequest<AnilistMedia[]>(`anilist/manga/list`, {
            ids: list
        }));

        let sortables: AnilistMediaSortable[] = [];
        mangaList.forEach((manga: AnilistMedia) => {
            sortables.push(AnilistMediaSortable.fromMediaData(manga));
        });

        return sortables;
    }

    override async getFavoriteList(userName: string, mangaList: AnilistMediaSortable[], page: number): Promise<AnilistMediaSortable[]> {
        let query = gql`
        {
            User(name: "${userName}") {
                favourites {
                    manga(page: ${page}, perPage: 25) {
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
        let manga: AnilistMediaSortable[] = this.parseFavoriteList(result);

        if (result.User.favourites.manga.pageInfo.hasNextPage) {
            let nextList = await this.getFavoriteList(userName, manga, page + 1);
            let returnValue = mangaList.concat(nextList);
            return returnValue;
        }
        else {
            return mangaList.concat(manga);
        }
    }

    parseFavoriteList(favoriteList: FavoriteList): AnilistMediaSortable[] {
        let mangaList: AnilistMediaSortable[] = [];
        let list: MangaNode[] = favoriteList.User.favourites.manga.nodes;
        list.forEach((node: MangaNode) => {
            let manga = new AnilistMediaSortable(
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
            mangaList.push(manga);
        });
        return mangaList;
    }

    override async getItemListFromIds(idList: number[], mangaList: AnilistMediaSortable[], page: number): Promise<AnilistMediaSortable[]> {
        let ids = JSON.stringify(idList);
        let query = gql`
        {
            Page(page: ${page}, perPage: 50) {
                media(type: MANGA, id_in: ${ids}) {
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

        let result = (await this.runGraphQLQuery(query)) as MangaList;
        let manga: AnilistMediaSortable[] = this.parseMangaList(result);

        if (result.Page.pageInfo.hasNextPage) {
            let nextList = await this.getItemListFromIds(idList, manga, page + 1);
            let returnValue = mangaList.concat(nextList);
            return returnValue;
        }
        else {
            return mangaList.concat(manga);
        }
    }

    parseMangaList(manga: MangaList): AnilistMediaSortable[] {
        let mangaList: AnilistMediaSortable[] = [];
        let nodes: MangaNode[] = manga.Page.media;
        nodes.forEach((node: MangaNode) => {
            let mangaItem = new AnilistMediaSortable(
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
            mangaList.push(mangaItem);
        });
        return mangaList;
    }
}
