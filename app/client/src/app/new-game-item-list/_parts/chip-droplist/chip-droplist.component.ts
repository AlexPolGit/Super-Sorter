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
    @Input() optionListGenerator: () => string[] = () => [];

    @Input() filterTitle: string = "";
    @Input() filterCheckboxLabel: string = "";
    @Input() filterTypeLabel: string = "";
    @Input() listLabel: string = "";

    @Output() onChange: EventEmitter<ChipDroplistUpdate> = new EventEmitter();

    filteredOptions: string[] = [];
    currentOption: string = "";

    selectedOptions: Set<string> = new Set<string>();
    filterType: ChipDroplistFilterTypes = "and";
    extraCheckbox: boolean = false;

    ngOnChanges(changes: any) {
        this.filterOptions("");
    }

    filterOptions(optionValue: string) {
        this.filteredOptions = this.optionListGenerator().filter(options => options.toLocaleUpperCase().includes(optionValue.toLocaleUpperCase()));
    }

    addOption(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (this.optionListGenerator().includes(value)) {
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
        console.log(this.extraCheckbox);
        this.onChange.emit({
            options: this.selectedOptions,
            type: this.filterType,
            extraCheckbox: this.extraCheckbox
        });
    }
}
