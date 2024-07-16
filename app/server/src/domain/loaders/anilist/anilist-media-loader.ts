import { SortableItemDto } from "../../../../../lib/src/objects/sortable.js";
import { AnilistDate, AnilistMediaSortableData } from "../../../../../lib/src/objects/sortables/anilist-media.js";
import { AnilistLoader } from "./anilist-loader.js";

interface UserPage {
    Page: {
        mediaList: {
            media: MediaNode;
        }[];
        pageInfo: PageInfo;
    }
}

export interface UserFavourites {
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

export interface MediaPage {
    Page: {
        media: MediaNode[];
        pageInfo: PageInfo;
    }
}

export interface UserMediaListCollection {
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

export abstract class AnilistMediaLoader extends AnilistLoader {

    protected parseMediaList(nodes: MediaNode[]): SortableItemDto<AnilistMediaSortableData>[] {
        let mediaList: SortableItemDto<AnilistMediaSortableData>[] = [];
        nodes.forEach((node: MediaNode) => {
            let data: AnilistMediaSortableData = {
                imageUrl: node.coverImage.large,
                title_romaji: node.title.romaji,
                title_english: node.title.english,
                title_native: node.title.native,
                format: node.format,
                favourites: node.favourites,
                meanScore: (node.meanScore / 10),
                status: node.status,
                genres: node.genres,
                tags: [], // Tags don't work with favourites query.
                season: node.season,
                seasonYear: node.seasonYear
            };

            mediaList.push(
                {
                    id: `${node.id}`,
                    data: data
                }
            );
        });
        return mediaList;
    }

    protected parseMediaListCollection(collection: UserMediaListCollection, tagPercentMinimum: number = 60): SortableItemDto<AnilistMediaSortableData>[] {
        let mediaList: SortableItemDto<AnilistMediaSortableData>[] = [];
        collection.MediaListCollection.lists.forEach((list: MediaList) => {
            list.entries.forEach((entry: MediaEntry) => {
                let node: MediaNode = entry.media;
                let data: AnilistMediaSortableData = {
                    imageUrl: node.coverImage.large,
                    title_romaji: node.title.romaji,
                    title_english: node.title.english,
                    title_native: node.title.native,
                    format: node.format,
                    favourites: node.favourites,
                    meanScore: (node.meanScore / 10),
                    status: node.status,
                    genres: node.genres,
                    tags: node.tags.filter(tag => tag.rank >= tagPercentMinimum).map(tag => tag.name),
                    season: node.season,
                    seasonYear: node.seasonYear,
                    userData: {
                        score: entry.score,
                        status: entry.status,
                        startedAt: entry.startedAt,
                        completedAt: entry.completedAt
                    }
                };
                mediaList.push({
                    id: `${node.id}`,
                    data: data
                });
            });
        });
        return mediaList;
    }
}
