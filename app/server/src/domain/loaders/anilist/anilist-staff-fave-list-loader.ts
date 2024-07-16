import { gql } from "graphql-request";
import { SortableItemDto } from "../../../../../lib/src/objects/sortable.js";
import { AnilistStaffLoader, FavoriteList } from "./anilist-staff-loader.js";
import { AnilistStaffSortableData } from "../../../../../lib/src/objects/sortables/anilist-staff.js";

export class AnilistStaffFaveListLoader extends AnilistStaffLoader {

    override async loadItemsFromSource(userName: string): Promise<SortableItemDto<AnilistStaffSortableData>[]> {
        return await this.getFavoriteList(userName, [], 1);
    }

    protected async getFavoriteList(userName: string, staffList: SortableItemDto<AnilistStaffSortableData>[], page: number): Promise<SortableItemDto<AnilistStaffSortableData>[]> {
        let query = gql`
        {
            User(name: "${userName}") {
                favourites {
                    staff(page: ${page}, perPage: 25) {
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

        let result = await this.runAnilistQuery<FavoriteList>(query);
        let staff = this.parseStaffList(result.User.favourites.staff.nodes);

        if (result.User.favourites.staff.pageInfo.hasNextPage) {
            let nextList = await this.getFavoriteList(userName, staff, page + 1);
            let returnValue = staffList.concat(nextList);
            return returnValue;
        }
        else {
            return staffList.concat(staff);
        }
    }
}
