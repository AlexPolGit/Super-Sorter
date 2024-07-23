import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { SortableObject } from 'src/app/_objects/sortables/sortable';

export interface ChipDroplistUpdate {
    options: Set<string>;
    type: ChipDroplistFilterTypes;
    extraCheckbox: boolean;
}

export type ChipDroplistFilterTypes = "and" | "or";

@Component({
    selector: 'app-chip-droplist',
    standalone: true,
    imports: [
        CommonModule,
        MatRadioModule,
        MatSelectModule,
        FormsModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatIconModule
    ],
    templateUrl: './chip-droplist.component.html',
    styleUrl: './chip-droplist.component.scss'
})
export class ChipDroplistComponent {

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    @Input() useAndOr: boolean = false;
    @Input() useExtraCheckbox: boolean = false;
    @Input() optionListGenerator: () => (string | SortableObject)[] = () => [];
    @Input() getStringValue: (item: any) => string = (item: any) => String(item);

    @Input() filterTitle: string = "";
    @Input() filterCheckboxLabel: string = "";
    @Input() filterTypeLabel: string = "";
    @Input() listLabel: string = "";

    @Output() onChange: EventEmitter<ChipDroplistUpdate> = new EventEmitter();

    filteredOptions: (string | SortableObject)[] = [];
    currentOption: string | SortableObject = "";

    selectedOptions: Set<string> = new Set();
    filterType: ChipDroplistFilterTypes = "and";
    extraCheckbox: boolean = false;

    ngOnChanges(changes: any) {
        this.filterOptions("");
    }

    optionSearch(text: string): string | SortableObject | null {
        for (let option of this.filteredOptions) {
            if (this.getStringValue(option) === text) {
                return option;
            }
        }
        return null;
    }

    filterOptions(optionValue: string | SortableObject) {
        if (typeof(optionValue) !== "string") {
            optionValue = "";
        }
        this.filteredOptions = this.optionListGenerator().filter(option => this.getStringValue(option).toLocaleUpperCase().includes(optionValue.toLocaleUpperCase()));
    }

    addOption(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        let searchResult = this.optionSearch(value);
        if (searchResult) {
            this.selectedOptions.add(value);
            this.currentOption = "";
            this.updateFilters();
        }
    }

    removeOption(toRemove: string): void {
        this.selectedOptions.delete(toRemove);
        this.updateFilters();
    }

    selectOption(event: MatAutocompleteSelectedEvent): void {
        this.selectedOptions.add(event.option.viewValue);
        this.currentOption = "";
        event.option.deselect();
        this.filterOptions("");
        this.updateFilters();
    }

    updateFilters() {
        this.onChange.emit({
            options: this.selectedOptions,
            type: this.filterType,
            extraCheckbox: this.extraCheckbox
        });
    }
}
