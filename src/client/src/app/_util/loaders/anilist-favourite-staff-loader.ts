import { gql } from "graphql-request";
import { AnilistStaffSortable } from "src/app/_objects/sortables/anilist-staff";
import { AnilistLoader } from "./anilist-loader";

export interface FavoriteList {
    User: User;
}

export interface User {
    favourites: Favourites;
}

export interface Favourites {
    staff: Staff;
}

export interface Staff {
    nodes: StaffNode[];
    pageInfo: PageInfo;
}

export interface StaffNode {
    id: number;
    name: Name;
    image: Image;
    age: string;
    gender: string;
    favourites: number;
}

export interface Image {
    large: string;
}

export interface Name {
    full: string;
    native: string;
}

export interface PageInfo {
    hasNextPage: boolean;
}

export class AnilistFavouriteStaffLoader extends AnilistLoader {

    constructor(userName: string) {
        super();
        this.inputData = userName;
    }

    async getObjects(): Promise<AnilistStaffSortable[]> {
        let objects = await this.getFavoriteList([], this.inputData, 0);
        return objects;
    }

    async getFavoriteList(staffList: AnilistStaffSortable[], userName: string, page: number): Promise<AnilistStaffSortable[]> {
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

        let result = (await this.runQuery(query)) as FavoriteList;
        let staff: AnilistStaffSortable[] = this.parseFavoriteList(result);

        if (result.User.favourites.staff.pageInfo.hasNextPage) {
            let nextList = await this.getFavoriteList(staff, userName, page + 1);
            let returnValue = staffList.concat(nextList);
            return returnValue;
        }
        else {
            return staff;
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
}
