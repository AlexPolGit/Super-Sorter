import { firstValueFrom } from "rxjs";
import { gql } from "graphql-request";
import { AnilistLoader } from "./anilist-loader";
import { AnilistDate, AnilistMediaSortable } from "src/app/_objects/sortables/anilist-media";
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

interface UserMediaListCollection {
    MediaListCollection: {
        lists: MediaList[];
    }
}

interface MediaList {
    status: string;
    entries: MediaEntry[];
}

interface MediaEntry {
    media: MediaNode;
    score: number;
    status: string;
    startedAt: AnilistDate;
    completedAt: AnilistDate;
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
    tags: {
        name: string;
        rank: number;
    }[];
    season: "WINTER" | "SPRING" | "SUMMER" | "FALL";
    seasonYear: number;
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

    override async getUserList(userName: string, statuses: string[], anime: boolean, manga: boolean, mediaList: AnilistMediaSortable[], page: number, tagPercentMinimum: number = 60): Promise<AnilistMediaSortable[]> {
        
        let mediaResults: UserMediaListCollection;

        if (anime && manga) {
            let anime = await this.runUsernameQuery<UserMediaListCollection>(
                this.getUserMediaListCollectionQuery(userName, statuses, "ANIME")
            );
            let manga = await this.runUsernameQuery<UserMediaListCollection>(
                this.getUserMediaListCollectionQuery(userName, statuses, "MANGA")
            );

            mediaResults = {
                MediaListCollection: {
                    lists: statuses.map((status: string) => {
                        console.log(`Getting anime and maga for status: ${status}`);
                        let animeItems = anime.MediaListCollection.lists.find(list => list.status === status);
                        let mangaItems = manga.MediaListCollection.lists.find(list => list.status === status);
                        if (!animeItems) {
                            animeItems = {
                                status: status,
                                entries: []
                            };
                        }
                        if (!mangaItems) {
                            mangaItems = {
                                status: status,
                                entries: []
                            };
                        }
                        return {
                            status: status,
                            entries: animeItems.entries.concat(mangaItems.entries)
                        }
                    })
                }
            };
        }
        else if (anime && !manga) {
            mediaResults = await this.runUsernameQuery<UserMediaListCollection>(
                this.getUserMediaListCollectionQuery(userName, statuses, "ANIME")
            );
        }
        else if (!anime && manga) {
            mediaResults = await this.runUsernameQuery<UserMediaListCollection>(
                this.getUserMediaListCollectionQuery(userName, statuses, "MANGA")
            );
        }
        else {
            return [];
        }

        return this.parseMediaListCollection(mediaResults, tagPercentMinimum);
    }

    getUserMediaListCollectionQuery(userName: string, statuses: string[], type: "ANIME" | "MANGA"): string {
        return gql`
        {
            MediaListCollection(
                userName: "${userName}", 
                type: ${type},
                status_in: [${statuses.join(",")}],
                forceSingleCompletedList: true
            ) {
                lists {
                status,
                    entries {
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
                            genres,
                            tags {
                                name,
                                rank
                            },
                            season,
                            seasonYear
                        },
                        score (format: POINT_10_DECIMAL),
                        status,
                        startedAt {
                            year,
                            month,
                            day
                        },
                        completedAt {
                            year,
                            month,
                            day
                        }
                    }
                }
            }
        }`;
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
                            genres,
                            season,
                            seasonYear
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
                            genres,
                            season,
                            seasonYear
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
                    genres,
                    tags {
                        name,
                        rank
                    },
                    season,
                    seasonYear
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
                (node.meanScore / 10),
                node.status,
                node.format,
                node.genres,
                [], // Tags don't work with favourites query.
                node.season,
                node.seasonYear,
            );
            mediaList.push(mediaItem);
        });
        return mediaList;
    }

    parseMediaListCollection(collection: UserMediaListCollection, tagPercentMinimum: number = 60) {
        let mediaList: AnilistMediaSortable[] = [];
        collection.MediaListCollection.lists.forEach((list: MediaList) => {
            list.entries.forEach((entry: MediaEntry) => {
                let node: MediaNode = entry.media;
                let mediaItem = new AnilistMediaSortable(
                    `${node.id}`,
                    node.coverImage.large,
                    node.title.romaji,
                    node.title.english,
                    node.title.native,
                    node.favourites,
                    (node.meanScore / 10),
                    node.status,
                    node.format,
                    node.genres,
                    node.tags.filter(tag => tag.rank >= tagPercentMinimum).map(tag => tag.name),
                    node.season,
                    node.seasonYear,
                    entry.score,
                    entry.status,
                    entry.startedAt,
                    entry.completedAt
                );
                mediaList.push(mediaItem);
            });
        });
        return mediaList;
    }
}
