import { gql } from "graphql-request";
import { SortableItemDto, AnilistMediaSortableData } from "@sorter/api";
import { AnilistMediaLoader, UserFavourites } from "./anilist-media-loader.js";

export class AnilistMediaFaveListLoader extends AnilistMediaLoader {

    override async loadItemsFromSource(userName: string): Promise<SortableItemDto<AnilistMediaSortableData>[]> {
        return await this.getFavoriteList(userName, [], 1);
    }

    protected async getFavoriteList(userName: string, mediaList: SortableItemDto<AnilistMediaSortableData>[], page: number): Promise<SortableItemDto<AnilistMediaSortableData>[]> {
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
        let anime: SortableItemDto<AnilistMediaSortableData>[] = this.parseMediaList(result.User.favourites.anime.nodes);
        let manga: SortableItemDto<AnilistMediaSortableData>[] = this.parseMediaList(result.User.favourites.manga.nodes);
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
}
