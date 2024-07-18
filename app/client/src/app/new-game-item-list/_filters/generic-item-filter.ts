import { Pipe } from '@angular/core';
import { GenericSortable } from 'src/app/_objects/sortables/generic-item';
import { UserPreferenceService } from 'src/app/_services/user-preferences-service';
import { FilterSettings, ItemListFilter } from './item-list-filter';
import { SortableObjectChoice } from '../item-list.component';

export interface GenericItemFilterSettings extends FilterSettings {}

@Pipe({
    name: 'genericItemFilter',
    pure: false
})
export class GenericItemFilter extends ItemListFilter {

    constructor(public userPreferenceService: UserPreferenceService) {
        super();
    }

    override transform(genericItems: SortableObjectChoice<GenericSortable>[], filter: GenericItemFilterSettings) {
        return genericItems.sort(
            (itemA: SortableObjectChoice<GenericSortable>, itemB: SortableObjectChoice<GenericSortable>) => {
                return itemA.item.getDisplayName().localeCompare(itemB.item.getDisplayName());
            }
        );
    }
}