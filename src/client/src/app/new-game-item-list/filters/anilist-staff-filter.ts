import { Pipe } from '@angular/core';
import { UserPreferenceService } from 'src/app/_services/user-preferences-service';
import { FilterSettings, ItemListFilter } from './item-list-filter';
import { AnilistStaffSortable } from 'src/app/_objects/sortables/anilist-staff';
import { SortableObjectChoice } from '../item-list.component';

export interface AnilistStaffFilterSettings extends FilterSettings {
    gender: {
        male: boolean,
        female: boolean,
        other: boolean,
        none: boolean
    };
    age: {
        min?: number,
        max?: number
    };
    favourites: {
        min?: number,
        max?: number
    };
}

@Pipe({
    name: 'anilistStaffFilter',
    pure: false
})
export class AnilistStaffFilter extends ItemListFilter {

    constructor(public userPreferenceService: UserPreferenceService) {
        super();
    }

    override transform(staffList: SortableObjectChoice<AnilistStaffSortable>[], filter: AnilistStaffFilterSettings) {
        if (!staffList || !filter) {
            return staffList;
        }

        let staffs = staffList.filter((item: SortableObjectChoice<AnilistStaffSortable>) => {
            let staff: AnilistStaffSortable = item.item;
        
            if (staff.gender === "Male") {
                if (!filter.gender.male) {
                    false;
                }
            }
            else if (staff.gender === "Female") {
                if (!filter.gender.female) {
                    false;
                }
            }
            else if (staff.gender !== null) {
                if (!filter.gender.other) {
                    false;
                }
            }
            else if (staff.gender === null) {
                if (!filter.gender.none) {
                    false;
                }
            }

            if (staff.age) {
                let age = parseInt(staff.age);

                if (filter.age.min && age < filter.age.min) {
                    false;
                }

                if (filter.age.max && age > filter.age.max) {
                    false;
                }

                if (filter.age.max && Number.isNaN(age)) {
                    false;
                }
            }
            else if ((filter.age.min || filter.age.max) && staff.age === null) {
                false;
            }

            if (staff.favourites) {
                if (filter.favourites.min && staff.favourites < filter.favourites.min) {
                    false;
                }

                if (filter.favourites.max && staff.favourites > filter.favourites.max) {
                    false;
                }
            }
            else if (filter.favourites.min || filter.favourites.max) {
                false;
            }

            return true;
        });

        return staffs.sort(
            (itemA: SortableObjectChoice<AnilistStaffSortable>, itemB: SortableObjectChoice<AnilistStaffSortable>) => {
                return itemA.item.getDisplayName(this.userPreferenceService.getAnilistLanguage())
                    .localeCompare(itemB.item.getDisplayName(this.userPreferenceService.getAnilistLanguage()));
            }
        );
    }
}