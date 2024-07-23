import { Component } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { UserPreferenceService } from 'src/app/_services/user-preferences-service';
import { AnilistCharacterFilter, AnilistCharacterFilterSettings } from '../_filters/anilist-character-filter';
import { ItemListComponent } from '../item-list.component';
import { CheckboxGridUpdate } from '../_parts/checkbox-grid/checkbox-grid.component';
import { DoubleEndedNumberInputUpdate } from '../_parts/double-ended-number-input/double-ended-number-input.component';

@Component({
    selector: 'app-anilist-character-list',
    templateUrl: './anilist-character-list.component.html',
    styleUrl: './anilist-character-list.component.scss'
})
export class AnilistCharacterListComponent extends ItemListComponent {

    readonly genderFilterTitle: string = $localize`:@@anilist-character-list-gender:Gender`;
    readonly genderOptions: string[] = [
        $localize`:@@anilist-character-list-gender-male:Male`,
        $localize`:@@anilist-character-list-gender-female:Female`,
        $localize`:@@anilist-character-list-gender-other:Other`,
        $localize`:@@anilist-character-list-gender-none:[No Data]`
    ];

    readonly ageFilterTitle: string = $localize`:@@anilist-character-list-age:Age`;
    readonly ageMinLabel: string = $localize`:@@anilist-character-list-age-min:Min`;
    readonly ageMinPlaceholder: string = $localize`:@@anilist-character-list-age-min:Min`;
    readonly ageMaxLabel: string = $localize`:@@anilist-character-list-age-max:Max`;
    readonly ageMaxPlaceholder: string = $localize`:@@anilist-character-list-age-max:Max`;

    readonly favouritesTitle: string = $localize`:@@anilist-character-list-favourites:Favourites`;
    readonly favouritesMinLabel: string = $localize`:@@anilist-character-list-favourites-min:Min`;
    readonly favouritesMinPlaceholder: string = $localize`:@@anilist-character-list-favourites-min:Min`;
    readonly favouritesMaxLabel: string = $localize`:@@anilist-character-list-favourites-max:Max`;
    readonly favouritesMaxPlaceholder: string = $localize`:@@anilist-character-list-favourites-max:Max`;

    override filters: AnilistCharacterFilterSettings = {
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
        public anilistCharacterFilter: AnilistCharacterFilter,
        private userPreferenceService: UserPreferenceService
    ) {
        super(anilistCharacterFilter);
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
