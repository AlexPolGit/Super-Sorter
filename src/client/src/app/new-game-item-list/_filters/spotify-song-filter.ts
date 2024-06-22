import { Pipe } from '@angular/core';
import { SpotifySongSortable } from 'src/app/_objects/sortables/spotify-song';
import { UserPreferenceService } from 'src/app/_services/user-preferences-service';
import { FilterSettings, ItemListFilter } from './item-list-filter';
import { SortableObjectChoice } from '../item-list.component';

export interface SpotifySongFilterSettings extends FilterSettings {}

@Pipe({
    name: 'spotifySongFilter',
    pure: false
})
export class SpotifySongFilter extends ItemListFilter {

    constructor(public userPreferenceService: UserPreferenceService) {
        super();
    }

    override transform(songs: SortableObjectChoice<SpotifySongSortable>[], filter: SpotifySongFilterSettings) {
        return songs.sort(
            (itemA: SortableObjectChoice<SpotifySongSortable>, itemB: SortableObjectChoice<SpotifySongSortable>) => {
                return itemA.item.getDisplayName().localeCompare(itemB.item.getDisplayName());
            }
        );
    }
}