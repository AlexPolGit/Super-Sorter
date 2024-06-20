import { Component, Input } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { FilterSettings } from './filters/item-list-filter';

export interface SortableObjectChoice<SortableType> {
    item: SortableType;
    selected: boolean;
    filteredOut: boolean;
}

@Component({
    selector: 'new-game-item-list-component',
    template: ``
})
export class ItemListComponent<ItemType extends SortableObject> {
    @Input() startingItems: Map<string, SortableObjectChoice<ItemType>> = new Map();
    @Input() currentlyLoading: boolean = false;

    filters: FilterSettings = {};
}
