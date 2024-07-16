import { gql } from "graphql-request";
import { SortableItemDto } from "../../../../../lib/src/objects/sortable.js";
import { AnilistStaffLoader, StaffList } from "./anilist-staff-loader.js";
import { AnilistStaffSortableData } from "../../../../../lib/src/objects/sortables/anilist-staff.js";

export class AnilistStaffIdLoader extends AnilistStaffLoader {

    override async loadItemsFromSource(idList: number[]): Promise<SortableItemDto<AnilistStaffSortableData>[]> {
        return await this.getItemListFromIds(idList, [], 1);
    }

    protected async getItemListFromIds(idList: number[], staffList: SortableItemDto<AnilistStaffSortableData>[], page: number): Promise<SortableItemDto<AnilistStaffSortableData>[]> {
        let ids = JSON.stringify(idList);
        let query = gql`
        {
            Page (page: ${page}, perPage: 50) {
                staff(id_in: ${ids}) {
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
        }`

        let result = (await this.runAnilistQuery(query)) as StaffList;
        let staff = this.parseStaffList(result.Page.staff);

        if (result.Page.pageInfo.hasNextPage) {
            let nextList = await this.getItemListFromIds(idList, staff, page + 1);
            let returnValue = staffList.concat(nextList);
            return returnValue;
        }
        else {
            return staffList.concat(staff);
        }
    }
}
