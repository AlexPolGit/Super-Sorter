import { Pipe } from '@angular/core';
import { AnilistMediaSortable } from 'src/app/_objects/sortables/anilist-media';
import { UserPreferenceService } from 'src/app/_services/user-preferences-service';
import { FilterSettings, ItemListFilter } from './item-list-filter';
import { SortableObjectChoice } from '../item-list.component';

export interface AnilistMediaFilterSettings extends FilterSettings {}

@Pipe({
    name: 'anilistMediaFilter',
    pure: false
})
export class AnilistMediaFilter extends ItemListFilter {

    constructor(public userPreferenceService: UserPreferenceService) {
        super();
    }

    override transform(media: SortableObjectChoice<AnilistMediaSortable>[], filter: AnilistMediaFilterSettings) {
        return media.sort(
            (itemA: SortableObjectChoice<AnilistMediaSortable>, itemB: SortableObjectChoice<AnilistMediaSortable>) => {
                return itemA.item.getDisplayName(this.userPreferenceService.getAnilistLanguage())
                    .localeCompare(itemB.item.getDisplayName(this.userPreferenceService.getAnilistLanguage()));
            }
        );
    }
}