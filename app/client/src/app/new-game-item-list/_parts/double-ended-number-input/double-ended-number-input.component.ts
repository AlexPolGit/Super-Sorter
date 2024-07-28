import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface DoubleEndedNumberInputUpdate {
    leftValue?: number;
    rightValue?: number;
}

@Component({
    selector: 'app-double-ended-number-input',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule
    ],
    templateUrl: './double-ended-number-input.component.html',
    styleUrl: './double-ended-number-input.component.scss'
})
export class DoubleEndedNumberInputComponent {
    @Input() filterTitle: string = "";

    @Input() leftLabel: string = "";
    @Input() leftPlaceholder: string = "";
    @Input() leftMin: number | null = null;
    @Input() leftMax: number | null = null;

    @Input() rightLabel: string = "";
    @Input() rightPlaceholder: string = "";
    @Input() rightMin: number | null = null;
    @Input() rightMax: number | null = null;

    @Output() onChange: EventEmitter<DoubleEndedNumberInputUpdate> = new EventEmitter();

    leftValue: number | undefined = undefined;
    rightValue: number | undefined = undefined;

    updateFilters() {
        this.onChange.emit({
            leftValue: this.leftValue,
            rightValue: this.rightValue
        });
    }
}
