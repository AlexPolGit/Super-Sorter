import { Pipe } from '@angular/core';
import { KeyValue } from '@angular/common';
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
export class AnilistStaffFilter extends ItemListFilter<AnilistStaffSortable> {

    constructor(public userPreferenceService: UserPreferenceService) {
        super();
    }

    override transform(staffList: KeyValue<string, SortableObjectChoice<AnilistStaffSortable>>[], filter: AnilistStaffFilterSettings) {
        if (!staffList || !filter) {
            return staffList;
        }

        let staffs = staffList.filter((item: KeyValue<string, SortableObjectChoice<AnilistStaffSortable>>) => {
            let staff: AnilistStaffSortable = item.value.item;
        
            if (staff.gender === "Male") {
                if (!filter.gender.male) {
                    return this.filterOut(item.value);
                }
            }
            else if (staff.gender === "Female") {
                if (!filter.gender.female) {
                    return this.filterOut(item.value);
                }
            }
            else if (staff.gender !== null) {
                if (!filter.gender.other) {
                    return this.filterOut(item.value);
                }
            }
            else if (staff.gender === null) {
                if (!filter.gender.none) {
                    return this.filterOut(item.value);
                }
            }

            if (staff.age) {
                let age = parseInt(staff.age);

                if (filter.age.min && age < filter.age.min) {
                    return this.filterOut(item.value);
                }

                if (filter.age.max && age > filter.age.max) {
                    return this.filterOut(item.value);
                }

                if (filter.age.max && Number.isNaN(age)) {
                    return this.filterOut(item.value);
                }
            }
            else if ((filter.age.min || filter.age.max) && staff.age === null) {
                return this.filterOut(item.value);
            }

            if (staff.favourites) {
                if (filter.favourites.min && staff.favourites < filter.favourites.min) {
                    return this.filterOut(item.value);
                }

                if (filter.favourites.max && staff.favourites > filter.favourites.max) {
                    return this.filterOut(item.value);
                }
            }
            else if (filter.favourites.min || filter.favourites.max) {
                return this.filterOut(item.value);
            }

            return this.keepItem(item.value);
        });

        return staffs.sort(
            (itemA: KeyValue<string, SortableObjectChoice<AnilistStaffSortable>>, itemB: KeyValue<string, SortableObjectChoice<AnilistStaffSortable>>) => {
                return itemA.value.item.getDisplayName(this.userPreferenceService.getAnilistLanguage())
                    .localeCompare(itemB.value.item.getDisplayName(this.userPreferenceService.getAnilistLanguage()));
            }
        );
    }
}