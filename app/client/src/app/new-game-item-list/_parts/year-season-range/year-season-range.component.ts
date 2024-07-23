import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, inject, Input, LOCALE_ID, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export interface YearSeasonRangeUpdate {
    minYear?: number;
    minSeason?: string;
    maxYear?: number;
    maxSeason?: string;
}

export interface SeasonOption {
    value: string;
    displayName: string;
}

@Component({
    selector: 'app-year-season-range',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule
    ],
    templateUrl: './year-season-range.component.html',
    styleUrl: './year-season-range.component.scss'
})
export class YearSeasonRangeComponent {

    @Input() seasonList: SeasonOption[] = [];
    @Input() filterTitle: string = "";
    @Input() fromYearLabel: string = $localize`:@@year-season-range-year-min:From Year`;
    @Input() fromSeasonLabel: string = $localize`:@@year-season-range-season-min:From Season`;
    @Input() toYearLabel: string = $localize`:@@year-season-range-year-max:To Year`;
    @Input() toSeasonLabel: string = $localize`:@@year-season-range-season-max:To Season`;
    @Input() minYear: number = 0;
    @Input() maxYear: number = 0;

    @Output() onChange: EventEmitter<YearSeasonRangeUpdate> = new EventEmitter();

    minYearValue?: number = undefined;
    minSeasonValue?: string = undefined;
    maxYearValue?: number = undefined;
    maxSeasonValue?: string = undefined;

    private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
    private readonly _intl = inject(MatDatepickerIntl);
    private readonly _locale = signal(inject<unknown>(LOCALE_ID));

    constructor(@Inject(LOCALE_ID) public activeLocale: string) {}

    updateFilters() {
        this.onChange.emit({
            minYear: this.minYearValue,
            minSeason: this.minSeasonValue,
            maxYear: this.maxYearValue,
            maxSeason: this.maxSeasonValue
        });
    }
}