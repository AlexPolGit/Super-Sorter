import { gql } from "graphql-request";
import { SortableItemDto } from "@sorter/api/src/objects/sortable.js";
import { AnilistStaffLoader, StaffList } from "./anilist-staff-loader.js";

export class AnilistStaffIdLoader extends AnilistStaffLoader {

    override async loadItemsFromSource(idList: number[]): Promise<Map<string, SortableItemDto>> {
        let items = await this.getItemListFromIds(idList, [], 1);
        return new Map(items.map(obj => [obj.id, obj]));
    }

    async getItemListFromIds(idList: number[], staffList: SortableItemDto[], page: number): Promise<SortableItemDto[]> {
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
        let staff: SortableItemDto[] = this.parseStaffList(result.Page.staff);

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
