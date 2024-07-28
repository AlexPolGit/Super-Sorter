import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';

export interface DoubleEndedSliderUpdate {
    smallValue: number;
    largeValue: number;
    extraCheckbox: boolean;
}

@Component({
    selector: 'app-double-ended-slider',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatSliderModule
    ],
    templateUrl: './double-ended-slider.component.html',
    styleUrl: './double-ended-slider.component.scss'
})
export class DoubleEndedSliderComponent {

    @Input() useExtraCheckbox: boolean = false;
    @Input() filterTitle: string = "";
    @Input() filterCheckboxLabel: string = "";

    @Input() min: number = 0;
    @Input() max: number = 100;
    @Input() step: number = 1;

    @Output() onChange: EventEmitter<DoubleEndedSliderUpdate> = new EventEmitter();

    smallValue: number = 0;
    largeValue: number = 0;
    extraCheckbox: boolean = false;

    ngOnChanges(changes: any) {
        this.smallValue = this.min;
        this.largeValue = this.max;
    }

    updateFilters() {
        this.onChange.emit({
            smallValue: this.smallValue,
            largeValue: this.largeValue,
            extraCheckbox: this.extraCheckbox
        });
    }
}
