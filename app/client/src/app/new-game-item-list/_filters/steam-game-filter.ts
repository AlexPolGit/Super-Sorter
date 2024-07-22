import { Pipe } from '@angular/core';
import { UserPreferenceService } from 'src/app/_services/user-preferences-service';
import { FilterSettings, ItemListFilter } from './item-list-filter';
import { SortableObjectChoice } from '../item-list.component';
import { SteamGameSortable } from 'src/app/_objects/sortables/steam-game';

export interface SteamGameFilterSettings extends FilterSettings {}

@Pipe({
    name: 'steamGameFilter',
    pure: false
})
export class SteamGameFilter extends ItemListFilter {

    constructor(public userPreferenceService: UserPreferenceService) {
        super();
    }

    override transform(gameList: SortableObjectChoice<SteamGameSortable>[], filter: SteamGameFilterSettings) {
        if (!gameList || !filter) {
            return gameList;
        }

        return gameList.sort(
            (itemA: SortableObjectChoice<SteamGameSortable>, itemB: SortableObjectChoice<SteamGameSortable>) => {
                return itemA.item.getDisplayName().localeCompare(itemB.item.getDisplayName());
            }
        );
    }
}