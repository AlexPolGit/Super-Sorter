import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface CheckboxGridUpdate {
    values: boolean[];
}

@Component({
    selector: 'app-checkbox-grid',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatCheckboxModule
    ],
    templateUrl: './checkbox-grid.component.html',
    styleUrl: './checkbox-grid.component.scss'
})
export class CheckboxGridComponent {

    @Input() options: string[] = [];
    @Input() filterTitle: string = "";

    @Output() onChange: EventEmitter<CheckboxGridUpdate> = new EventEmitter();

    checkBoxValues: { displayName: string, value: boolean }[] = [];

    ngOnChanges(changes: any) {
        this.checkBoxValues = this.options.map(opt => {
            return {
                displayName: opt,
                value: true
            };
        });
    }

    updateFilters() {
        this.onChange.emit({
            values: this.checkBoxValues.map(checkbox => checkbox.value)
        });
    }
}
