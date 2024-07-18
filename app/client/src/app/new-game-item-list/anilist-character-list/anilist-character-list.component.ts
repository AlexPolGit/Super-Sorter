import { Component } from '@angular/core';
import { AnilistCharacterSortable } from 'src/app/_objects/sortables/anilist-character';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { UserPreferenceService } from 'src/app/_services/user-preferences-service';
import { AnilistCharacterFilter, AnilistCharacterFilterSettings } from '../_filters/anilist-character-filter';
import { ItemListComponent } from '../item-list.component';

@Component({
    selector: 'app-anilist-character-list',
    templateUrl: './anilist-character-list.component.html',
    styleUrl: './anilist-character-list.component.scss'
})
export class AnilistCharacterListComponent extends ItemListComponent {

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
}
