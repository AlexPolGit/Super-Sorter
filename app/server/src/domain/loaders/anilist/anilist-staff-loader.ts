import { SortableItemDto } from "@sorter/api/src/objects/sortable.js";
import { AnilistStaffSortableData } from "@sorter/api/src/objects/sortables/anilist-staff.js";
import { AnilistLoader } from "./anilist-loader.js";

export interface FavoriteList {
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

export interface StaffList {
    Page: StaffPage;
}

interface StaffPage {
    staff: StaffNode[];
    pageInfo: PageInfo;
}

export abstract class AnilistStaffLoader extends AnilistLoader {
    protected parseStaffList(nodes: StaffNode[]): SortableItemDto<AnilistStaffSortableData>[] {
        let staffList: SortableItemDto<AnilistStaffSortableData>[] = [];
        nodes.forEach((node: StaffNode) => {
            let data: AnilistStaffSortableData = {
                name: node.name.full,
                nameNative: node.name.native,
                imageUrl: node.image.large,
                age: node.age,
                gender: node.gender,
                favourites: node.favourites
            };

            staffList.push({
                id: `${node.id}`,
                data: data
            });
        });
        return staffList;
    }
}
