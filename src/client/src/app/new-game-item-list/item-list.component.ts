import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { FilterSettings, ItemListFilter } from './filters/item-list-filter';

export interface SortableObjectChoice<SortableType> {
    item: SortableType;
    selected: boolean;
}

@Component({
    selector: 'new-game-item-list-component',
    template: ``
})
export class ItemListComponent<ItemType extends SortableObject> {

    @Input() newItems: SortableObject[] = [];
    @Input() currentlyLoading: boolean = false;
    
    @Output() selectedItems = new EventEmitter<SortableObject[]>();

    startingItems: Map<string, SortableObjectChoice<ItemType>> = new Map();
    filteredItemList: SortableObjectChoice<SortableObject>[] = [];
    filters: FilterSettings = {};
    filterPipe: ItemListFilter;

    constructor(filterPipe: ItemListFilter) {
        this.filterPipe = filterPipe;
    }

    ngOnChanges(changes: any) {
        if (changes.newItems) {
            changes.newItems.currentValue.forEach((newItem: ItemType) => {
                this.startingItems.set(newItem.id, {
                    item: newItem,
                    selected: this.startingItems.has(newItem.id) ? (this.startingItems.get(newItem.id) as SortableObjectChoice<ItemType>).selected : true
                });
            });
            this.updateFilters();
        }
    }

    updateFilters() {
        this.filteredItemList = this.filterPipe.transform(Array.from(this.startingItems.values()), this.filters);
        this.selectedItems.emit(this.filteredItemList.filter(item => item.selected).map(item => item.item));
    }
}
