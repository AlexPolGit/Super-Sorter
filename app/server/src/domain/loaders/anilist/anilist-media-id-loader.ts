import { gql } from "graphql-request";
import { SortableItemDto } from "../../../../../lib/src/objects/sortable.js";
import { AnilistMediaSortableData } from "../../../../../lib/src/objects/sortables/anilist-media.js";
import { AnilistMediaLoader, MediaPage } from "./anilist-media-loader.js";

export class AnilistMediaIdLoader extends AnilistMediaLoader {

    override async loadItemsFromSource(idList: number[]): Promise<SortableItemDto<AnilistMediaSortableData>[]> {
        return await this.getItemListFromIds(idList, [], 1);
    }

    async getItemListFromIds(idList: number[], mediaList: SortableItemDto<AnilistMediaSortableData>[], page: number): Promise<SortableItemDto<AnilistMediaSortableData>[]> {
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
        let media: SortableItemDto<AnilistMediaSortableData>[] = this.parseMediaList(result.Page.media);

        if (result.Page.pageInfo.hasNextPage) {
            let nextList = await this.getItemListFromIds(idList, media, page + 1);
            let returnValue = mediaList.concat(nextList);
            return returnValue;
        }
        else {
            return mediaList.concat(media);
        }
    }
}
