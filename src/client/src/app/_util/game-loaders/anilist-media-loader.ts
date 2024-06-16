import { firstValueFrom } from "rxjs";
import { gql } from "graphql-request";
import { AnilistLoader } from "./anilist-loader";
import { AnilistMediaSortable } from "src/app/_objects/sortables/anilist-media";
import { AnilistMedia } from "src/app/_objects/server/anilist/anilist-media";

interface UserPage {
    Page: {
        mediaList: {
            media: MediaNode;
        }[];
        pageInfo: PageInfo;
    }
}

interface UserFavourites {
    User: {
        favourites: {
            anime: {
                nodes: MediaNode[]
                pageInfo: PageInfo
            };
            manga: {
                nodes: MediaNode[]
                pageInfo: PageInfo
            };
        }
    }
}

interface MediaPage {
    Page: {
        media: MediaNode[];
        pageInfo: PageInfo;
    }
}

interface MediaNode {
    id: number;
    title: {
        english: string;
        romaji: string;
        native: string;
    };
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

interface PageInfo {
    hasNextPage: boolean;
}

export class AnilistMediaLoader extends AnilistLoader {
    static override identifier: string = "anilist-media";

    async addSortablesFromListOfStrings(list: AnilistMediaSortable[]) {

        let mediaToAdd: AnilistMedia[] = [];
        list.forEach((media: AnilistMediaSortable) => {
            mediaToAdd.push(media.getMediaData());
        });

        await firstValueFrom(this.webService.postRequest(`anilist/media`, {
            media: mediaToAdd
        }));
    }

    async getSortablesFromListOfStrings(list: string[]): Promise<AnilistMediaSortable[]> {

        let mediaList = await firstValueFrom(this.webService.postRequest<AnilistMedia[]>(`anilist/media/list`, {
            ids: list
        }));

        let sortables: AnilistMediaSortable[] = [];
        mediaList.forEach((media: AnilistMedia) => {
            sortables.push(AnilistMediaSortable.fromMediaData(media));
        });

        return sortables;
    }

    async getUserList(userName: string, statuses: string[], anime: boolean, manga: boolean, mediaList: AnilistMediaSortable[], page: number): Promise<AnilistMediaSortable[]> {
        let animeMangaFitler;
        if (anime && manga) {
            animeMangaFitler = "";
        }
        else if (anime && !manga) {
            animeMangaFitler = ", type: ANIME";
        }
        else if (!anime && manga) {
            animeMangaFitler = ", type: MANGA";
        }
        else {
            return [];
        }

        let query = gql`
        {
            Page(page: ${page}, perPage: 50) {
                mediaList(userName: "${userName}", status_in: [${statuses.join(",")}]${animeMangaFitler}) {
                    media {
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
                    }
                },
                pageInfo {
                  hasNextPage
                }
            }
        }`

        let result = await this.runUsernameQuery<UserPage>(query);
        let media: AnilistMediaSortable[] = this.parseMediaList(result.Page.mediaList.map(m => {return m.media}));

        if (result.Page.pageInfo.hasNextPage) {
            let nextList = await this.getUserList(userName, statuses, anime, manga, media, page + 1);
            let returnValue = mediaList.concat(nextList);
            return returnValue;
        }
        else {
            return mediaList.concat(media);
        }
    }

    override async getFavoriteList(userName: string, mediaList: AnilistMediaSortable[], page: number): Promise<AnilistMediaSortable[]> {
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
                    },
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

        let result = await this.runUsernameQuery<UserFavourites>(query);
        let anime: AnilistMediaSortable[] = this.parseMediaList(result.User.favourites.anime.nodes);
        let manga: AnilistMediaSortable[] = this.parseMediaList(result.User.favourites.manga.nodes);
        let media = anime.concat(manga);

        if (result.User.favourites.anime.pageInfo.hasNextPage || result.User.favourites.manga.pageInfo.hasNextPage) {
            let nextList = await this.getFavoriteList(userName, media, page + 1);
            let returnValue = mediaList.concat(nextList);
            return returnValue;
        }
        else {
            return mediaList.concat(media);
        }
    }

    override async getItemListFromIds(idList: number[], mediaList: AnilistMediaSortable[], page: number): Promise<AnilistMediaSortable[]> {
        let ids = JSON.stringify(idList);
        let query = gql`
        {
            Page(page: ${page}, perPage: 50) {
                media(id_in: ${ids}) {
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

        let result = (await this.runAnilistQuery(query)) as MediaPage;
        let media: AnilistMediaSortable[] = this.parseMediaList(result.Page.media);

        if (result.Page.pageInfo.hasNextPage) {
            let nextList = await this.getItemListFromIds(idList, media, page + 1);
            let returnValue = mediaList.concat(nextList);
            return returnValue;
        }
        else {
            return mediaList.concat(media);
        }
    }

    parseMediaList(nodes: MediaNode[]): AnilistMediaSortable[] {
        let mediaList: AnilistMediaSortable[] = [];
        nodes.forEach((node: MediaNode) => {
            let mediaItem = new AnilistMediaSortable(
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
            mediaList.push(mediaItem);
        });
        return mediaList;
    }
}
