import { PipeTransform } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { SortableObjectChoice } from '../item-list.component';

export interface FilterSettings {}

export abstract class ItemListFilter implements PipeTransform {
    abstract transform(items: SortableObjectChoice<SortableObject>[], filter: FilterSettings): SortableObjectChoice<SortableObject>[];
}
