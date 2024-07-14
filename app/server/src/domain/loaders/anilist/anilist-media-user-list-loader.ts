import { gql } from "graphql-request";
import { SortableItemDto } from "@sorter/api/src/objects/sortable.js";
import { AnilistMediaSortableData } from "@sorter/api/src/objects/sortables/anilist-media.js";
import { AnilistMediaLoader, UserMediaListCollection } from "./anilist-media-loader.js";

interface UserListFilters {
    userName: string;
    statuses: string[];
    anime: boolean;
    manga: boolean;
    tagPercentMinimum: number;
}

export class AnilistMediaUserListLoader extends AnilistMediaLoader {

    override async loadItemsFromSource(filters: UserListFilters): Promise<SortableItemDto<AnilistMediaSortableData>[]> {
        return await this.getUserList(filters);
    }

    protected async getUserList(filters: UserListFilters): Promise<SortableItemDto<AnilistMediaSortableData>[]> {
        
        let mediaResults: UserMediaListCollection;

        if (filters.anime && filters.manga) {
            let anime = await this.runUsernameQuery<UserMediaListCollection>(
                this.getUserMediaListCollectionQuery(filters.userName, filters.statuses, "ANIME")
            );
            let manga = await this.runUsernameQuery<UserMediaListCollection>(
                this.getUserMediaListCollectionQuery(filters.userName, filters.statuses, "MANGA")
            );

            mediaResults = {
                MediaListCollection: {
                    lists: filters.statuses.map((status: string) => {
                        // console.log(`Getting anime and maga for status: ${status}`);
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
        else if (filters.anime && !filters.manga) {
            mediaResults = await this.runUsernameQuery<UserMediaListCollection>(
                this.getUserMediaListCollectionQuery(filters.userName, filters.statuses, "ANIME")
            );
        }
        else if (!filters.anime && filters.manga) {
            mediaResults = await this.runUsernameQuery<UserMediaListCollection>(
                this.getUserMediaListCollectionQuery(filters.userName, filters.statuses, "MANGA")
            );
        }
        else {
            return [];
        }

        return this.parseMediaListCollection(mediaResults, filters.tagPercentMinimum);
    }

    private getUserMediaListCollectionQuery(userName: string, statuses: string[], type: "ANIME" | "MANGA"): string {
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
}
