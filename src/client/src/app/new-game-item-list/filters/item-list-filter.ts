import { PipeTransform } from '@angular/core';
import { KeyValue } from '@angular/common';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { SortableObjectChoice } from '../item-list.component';

export interface FilterSettings {}

export abstract class ItemListFilter<ItemType extends SortableObject> implements PipeTransform {
    abstract transform(items: KeyValue<string, SortableObjectChoice<ItemType>>[], filter: FilterSettings): KeyValue<string, SortableObjectChoice<ItemType>>[];

    filterOut<T>(item: SortableObjectChoice<T>): boolean {
        item.filteredOut = true;
        return false;
    }

    keepItem<T>(item: SortableObjectChoice<T>): boolean {
        item.filteredOut = false;
        return true;
    }
}
