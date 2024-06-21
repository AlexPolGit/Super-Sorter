import { Component } from '@angular/core';
import { GenericSortable } from 'src/app/_objects/sortables/generic-item';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GenericItemFilter, GenericItemFilterSettings } from '../filters/generic-item-filter';
import { ItemListComponent } from '../item-list.component';

@Component({
    selector: 'app-generic-item-list',
    templateUrl: './generic-item-list.component.html',
    styleUrl: './generic-item-list.component.scss'
})
export class GenericItemListComponent extends ItemListComponent<GenericSortable> {

    override filters: GenericItemFilterSettings = {};

    constructor(
        public genericItemFilter: GenericItemFilter
    ) {
        super(genericItemFilter);
    }

    getItemDisplayName(item: SortableObject) {
        return item.getDetailedDisplayName();
    }
}
