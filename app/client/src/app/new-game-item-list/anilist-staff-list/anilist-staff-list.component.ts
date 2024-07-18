import { Component } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { UserPreferenceService } from 'src/app/_services/user-preferences-service';
import { ItemListComponent } from '../item-list.component';
import { AnilistStaffSortable } from 'src/app/_objects/sortables/anilist-staff';
import { AnilistStaffFilter, AnilistStaffFilterSettings } from '../_filters/anilist-staff-filter';

@Component({
    selector: 'app-anilist-staff-list',
    templateUrl: './anilist-staff-list.component.html',
    styleUrl: './anilist-staff-list.component.scss'
})
export class AnilistStaffListComponent extends ItemListComponent {

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
}
