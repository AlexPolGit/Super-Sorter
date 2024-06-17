import { firstValueFrom } from "rxjs";
import { gql } from "graphql-request";
import { AnilistLoader } from "./anilist-loader";
import { AnilistStaffSortable } from "src/app/_objects/sortables/anilist-staff";
import { AnilistStaff } from "src/app/_objects/server/anilist/anilist-staff";
import { SortableObject } from "src/app/_objects/sortables/sortable";
import { InterfaceError } from "src/app/_objects/custom-error";

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

export class AnilistStaffLoader extends AnilistLoader {
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

        let result = await this.runUsernameQuery<FavoriteList>(query);
        let staff: AnilistStaffSortable[] = this.parseStaffList(result.User.favourites.staff.nodes);

        if (result.User.favourites.staff.pageInfo.hasNextPage) {
            let nextList = await this.getFavoriteList(userName, staff, page + 1);
            let returnValue = staffList.concat(nextList);
            return returnValue;
        }
        else {
            return staffList.concat(staff);
        }
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

        let result = (await this.runAnilistQuery(query)) as StaffList;
        let staff: AnilistStaffSortable[] = this.parseStaffList(result.Page.staff);

        if (result.Page.pageInfo.hasNextPage) {
            let nextList = await this.getItemListFromIds(idList, staff, page + 1);
            let returnValue = staffList.concat(nextList);
            return returnValue;
        }
        else {
            return staffList.concat(staff);
        }
    }

    parseStaffList(nodes: StaffNode[]): AnilistStaffSortable[] {
        let characterList: AnilistStaffSortable[] = [];
        nodes.forEach((node: StaffNode) => {
            let char = new AnilistStaffSortable(
                `${node.id}`,
                node.image.large,
                node.name.full,
                node.name.native,
                node.age,
                node.gender,
                node.favourites
            );
            characterList.push(char);
        });
        return characterList;
    }

    override getUserList(): Promise<SortableObject[]> {
        throw new InterfaceError(`"AnilistStaffLoader" does not implement the "getUserList()" method.`);
    }
}
