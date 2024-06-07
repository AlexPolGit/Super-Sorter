import { firstValueFrom } from "rxjs";
import { gql } from "graphql-request";
import { AnilistLoader } from "./anilist-loader";
import { AnilistStaffSortable } from "src/app/_objects/sortables/anilist-staff";
import { AnilistStaff } from "src/app/_objects/server/anilist/anilist-staff";

interface FavoriteList {
    User: User;
}

interface User {
    favourites: Favourites;
}

interface Favourites {
    staff: Staff;
}

interface Staff {
    nodes: StaffNode[];
    pageInfo: PageInfo;
}

interface StaffNode {
    id: number;
    name: Name;
    image: Image;
    age: string;
    gender: string;
    favourites: number;
}

interface Image {
    large: string;
}

interface Name {
    full: string;
    native: string;
}

interface PageInfo {
    hasNextPage: boolean;
}

interface StaffList {
    Page: StaffPage;
}

interface StaffPage {
    staff: StaffNode[];
    pageInfo: PageInfo;
}


export class AnilistFavouriteStaffLoader extends AnilistLoader {
    static override identifier: string = "anilist-staff";

    async addSortablesFromListOfStrings(list: AnilistStaffSortable[]) {

        let staffToAdd: AnilistStaff[] = [];
        list.forEach((staff: AnilistStaffSortable) => {
            staffToAdd.push(staff.getStaffData());
        });

        await firstValueFrom(this.webService.postRequest(`anilist/staff`, {
            staff: staffToAdd
        }));
    }

    async getSortablesFromListOfStrings(list: string[]): Promise<AnilistStaffSortable[]> {

        let staffList = await firstValueFrom(this.webService.postRequest<AnilistStaff[]>(`anilist/staff/list`, {
            ids: list
        }));

        let sortables: AnilistStaffSortable[] = [];
        staffList.forEach((staff: AnilistStaff) => {
            sortables.push(AnilistStaffSortable.fromStaffData(staff));
        });

        return sortables;
    }

    async setupGame(startingData: string): Promise<AnilistStaffSortable[]> {
        return await this.getFavoriteList(startingData, [], 1);
    }

    override async getFavoriteList(userName: string, staffList: AnilistStaffSortable[], page: number): Promise<AnilistStaffSortable[]> {
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

        let result = (await this.runGraphQLQuery(query)) as FavoriteList;
        let staff: AnilistStaffSortable[] = this.parseFavoriteList(result);

        if (result.User.favourites.staff.pageInfo.hasNextPage) {
            let nextList = await this.getFavoriteList(userName, staff, page + 1);
            let returnValue = staffList.concat(nextList);
            return returnValue;
        }
        else {
            return staffList.concat(staff);
        }
    }

    parseFavoriteList(favoriteList: FavoriteList): AnilistStaffSortable[] {
        let staffList: AnilistStaffSortable[] = [];
        let list: StaffNode[] = favoriteList.User.favourites.staff.nodes;
        list.forEach((node: StaffNode) => {
            let staff = new AnilistStaffSortable(`${node.id}`, node.image.large , node.name.full, node.name.native);
            staffList.push(staff);
        });
        return staffList;
    }

    override async getItemListFromIds(idList: number[], staffList: AnilistStaffSortable[], page: number): Promise<AnilistStaffSortable[]> {
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

        let result = (await this.runGraphQLQuery(query)) as StaffList;
        let staff: AnilistStaffSortable[] = this.parseStaffList(result);

        if (result.Page.pageInfo.hasNextPage) {
            let nextList = await this.getItemListFromIds(idList, staff, page + 1);
            let returnValue = staffList.concat(nextList);
            return returnValue;
        }
        else {
            return staffList.concat(staff);
        }
    }

    parseStaffList(staff: StaffList): AnilistStaffSortable[] {
        let staffList: AnilistStaffSortable[] = [];
        let nodes: StaffNode[] = staff.Page.staff;
        nodes.forEach((node: StaffNode) => {
            let staffItem = new AnilistStaffSortable(
                `${node.id}`,
                node.image.large,
                node.name.full,
                node.age,
                node.gender,
                node.favourites,
                node.name.native
            );
            staffList.push(staffItem);
        });
        return staffList;
    }
}
