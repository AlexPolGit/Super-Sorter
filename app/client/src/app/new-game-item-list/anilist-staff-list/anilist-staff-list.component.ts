import { Component } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { UserPreferenceService } from 'src/app/_services/user-preferences-service';
import { ItemListComponent } from '../item-list.component';
import { AnilistStaffFilter, AnilistStaffFilterSettings } from '../_filters/anilist-staff-filter';
import { CheckboxGridUpdate } from '../_parts/checkbox-grid/checkbox-grid.component';
import { DoubleEndedNumberInputUpdate } from '../_parts/double-ended-number-input/double-ended-number-input.component';

@Component({
    selector: 'app-anilist-staff-list',
    templateUrl: './anilist-staff-list.component.html',
    styleUrl: './anilist-staff-list.component.scss'
})
export class AnilistStaffListComponent extends ItemListComponent {

    readonly genderFilterTitle: string = $localize`:@@anilist-staff-list-gender:Gender`;
    readonly genderOptions: string[] = [
        $localize`:@@anilist-staff-list-gender-male:Male`,
        $localize`:@@anilist-staff-list-gender-female:Female`,
        $localize`:@@anilist-staff-list-gender-other:Other`,
        $localize`:@@anilist-staff-list-gender-none:[No Data]`
    ];

    readonly ageFilterTitle: string = $localize`:@@anilist-staff-list-age:Age`;
    readonly ageMinLabel: string = $localize`:@@anilist-staff-list-age-min:Min`;
    readonly ageMinPlaceholder: string = $localize`:@@anilist-staff-list-age-min:Min`;
    readonly ageMaxLabel: string = $localize`:@@anilist-staff-list-age-max:Max`;
    readonly ageMaxPlaceholder: string = $localize`:@@anilist-staff-list-age-max:Max`;

    readonly favouritesTitle: string = $localize`:@@anilist-staff-list-favourites:Favourites`;
    readonly favouritesMinLabel: string = $localize`:@@anilist-staff-list-favourites-min:Min`;
    readonly favouritesMinPlaceholder: string = $localize`:@@anilist-staff-list-favourites-min:Min`;
    readonly favouritesMaxLabel: string = $localize`:@@anilist-staff-list-favourites-max:Max`;
    readonly favouritesMaxPlaceholder: string = $localize`:@@anilist-staff-list-favourites-max:Max`;

    override filters: AnilistStaffFilterSettings = {
        gender: {
            male: true,
            female: true,
            other: true,
            none: true
        },
        age: {
            min: undefined,
            max: undefined
        },
        favourites: {
            min: undefined,
            max: undefined
        }
    };

    constructor(
        public anilistStaffFilter: AnilistStaffFilter,
        private userPreferenceService: UserPreferenceService
    ) {
        super(anilistStaffFilter);
    }

    getItemDisplayName(item: SortableObject) {
        return item.getDetailedDisplayName(this.userPreferenceService.getAnilistLanguage());
    }

    updateGender(event: CheckboxGridUpdate) {
        this.filters.gender.male = event.values[0];
        this.filters.gender.female = event.values[1];
        this.filters.gender.other = event.values[2];
        this.filters.gender.none = event.values[3];
        this.updateFilters();
    }

    updateAge(event: DoubleEndedNumberInputUpdate) {
        this.filters.age.min = event.leftValue;
        this.filters.age.max = event.rightValue;
        this.updateFilters();
    }

    updateFavourites(event: DoubleEndedNumberInputUpdate) {
        this.filters.favourites.min = event.leftValue;
        this.filters.favourites.max = event.rightValue;
        this.updateFilters();
    }
}
