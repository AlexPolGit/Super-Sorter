import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

export interface CheckboxDroplistUpdate {
    options: CheckboxDroplistOption[];
    type: CheckboxDroplistFilterTypes;
}

export interface CheckboxDroplistOption {
    value: string;
    displayName: string;
}

export type CheckboxDroplistFilterTypes = "and" | "or";

@Component({
    selector: 'app-checkbox-droplist',
    standalone: true,
    imports: [
        CommonModule,
        MatRadioModule,
        MatSelectModule,
        FormsModule,
        MatFormFieldModule
    ],
    templateUrl: './checkbox-droplist.component.html',
    styleUrl: './checkbox-droplist.component.scss'
})
export class CheckboxDroplistComponent {

    @Input() useAndOr: boolean = false;
    @Input() optionList: CheckboxDroplistOption[] = [];
    @Input() filterTitle: string = "";
    @Input() filterTypeLabel: string = "";
    @Input() listLabel: string = "";

    @Output() onChange: EventEmitter<CheckboxDroplistUpdate> = new EventEmitter();

    selectedOptions: CheckboxDroplistOption[] = [];
    filterType: CheckboxDroplistFilterTypes = "and";

    updateFilters() {
        this.onChange.emit({
            options: this.selectedOptions,
            type: this.filterType
        });
    }
}
