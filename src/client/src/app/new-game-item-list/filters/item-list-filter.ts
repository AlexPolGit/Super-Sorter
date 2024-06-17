import { PipeTransform } from '@angular/core';
import { KeyValue } from '@angular/common';
import { SortableObject } from 'src/app/_objects/sortables/sortable';

export interface SortableObjectChoice<SortableType> {
    item: SortableType;
    selected: boolean;
}

export interface FilterSettings {}

export abstract class ItemListFilter<ItemType extends SortableObject> implements PipeTransform {
    abstract transform(items: KeyValue<string, SortableObjectChoice<ItemType>>[], filter: FilterSettings): KeyValue<string, SortableObjectChoice<ItemType>>[];
}
