import { gql } from "graphql-request";
import { SortableItemDto } from "@sorter/api/src/objects/sortable.js";
import { AnilistStaffLoader, FavoriteList } from "./anilist-staff-loader.js";

export class AnilistStaffFaveListLoader extends AnilistStaffLoader {

    override async loadItemsFromSource(userName: string): Promise<Map<string, SortableItemDto>> {
        let items = await this.getFavoriteList(userName, [], 1);
        return new Map(items.map(obj => [obj.id, obj]));
    }

    async getFavoriteList(userName: string, staffList: SortableItemDto[], page: number): Promise<SortableItemDto[]> {
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
        let staff: SortableItemDto[] = this.parseStaffList(result.User.favourites.staff.nodes);

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
