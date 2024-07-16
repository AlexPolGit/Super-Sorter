import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { FilterSettings, ItemListFilter } from './_filters/item-list-filter';

export interface SortableObjectChoice<SortableType> {
    item: SortableType;
    selected: boolean;
}

@Component({
    selector: 'new-game-item-list-component',
    template: ``
})
export class ItemListComponent {

    @Input() newItems: SortableObject[] = [];
    @Input() currentlyLoading: boolean = false;
    
    @Output() selectedItems = new EventEmitter<SortableObject[]>();

    startingItems: Map<string, SortableObjectChoice<SortableObject>> = new Map();
    filteredItemList: SortableObjectChoice<SortableObject>[] = [];
    filters: FilterSettings = {};
    filterPipe: ItemListFilter;

    constructor(filterPipe: ItemListFilter) {
        this.filterPipe = filterPipe;
    }

    ngOnChanges(changes: any) {
        if (changes.newItems) {
            const items = changes.newItems.currentValue as SortableObject[];
            items.forEach((newItem: SortableObject) => {
                this.startingItems.set(newItem.id, {
                    item: newItem,
                    selected: this.startingItems.has(newItem.id) ? (this.startingItems.get(newItem.id) as SortableObjectChoice<SortableObject>).selected : true
                });
            });
            this.updateFilters();
        }
    }

    updateFilters() {
        this.filteredItemList = this.filterPipe.transform(Array.from(this.startingItems.values()), this.filters);
        this.emitSelectedItems();
    }

    selectAll() {
        this.filteredItemList.forEach(item => item.selected = true);
        this.emitSelectedItems();
    }

    deselectAll() {
        this.filteredItemList.forEach(item => item.selected = false);
        this.emitSelectedItems();
    }

    emitSelectedItems() {
        this.selectedItems.emit(this.filteredItemList.filter(item => item.selected).map(item => item.item));
    }
}
