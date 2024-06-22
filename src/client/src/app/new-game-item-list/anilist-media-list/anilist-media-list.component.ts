import { Component } from '@angular/core';
import { AnilistMediaSortable } from 'src/app/_objects/sortables/anilist-media';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { UserPreferenceService } from 'src/app/_services/user-preferences-service';
import { AnilistMediaFilter, AnilistMediaFilterSettings } from '../_filters/anilist-media-filter';
import { ItemListComponent } from '../item-list.component';

@Component({
    selector: 'app-anilist-media-list',
    templateUrl: './anilist-media-list.component.html',
    styleUrl: './anilist-media-list.component.scss'
})
export class AnilistMediaListComponent extends ItemListComponent {

    override filters: AnilistMediaFilterSettings = {};

    constructor(
        public anilistMediaFilter: AnilistMediaFilter,
        private userPreferenceService: UserPreferenceService
    ) {
        super(anilistMediaFilter);
    }

    getItemDisplayName(item: SortableObject) {
        return item.getDetailedDisplayName(this.userPreferenceService.getAnilistLanguage());
    }
}
