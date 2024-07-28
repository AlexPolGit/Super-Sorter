import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Inject, Input, LOCALE_ID, Output, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

export interface RangeCalendarUpdate {
    start?: Date | null;
    end?: Date | null;
}

@Component({
    selector: 'app-range-calendar',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatDatepickerModule
    ],
    templateUrl: './range-calendar.component.html',
    styleUrl: './range-calendar.component.scss'
})
export class RangeCalendarComponent {

    @Input() filterTitle: string = "";
    @Input() fromName: string = $localize`:@@calendar-min-date-placeholder:From`;
    @Input() toName: string = $localize`:@@calendar-max-date-placeholder:To`;
    @Input() minDate: Date = new Date();
    @Input() maxDate: Date = new Date();

    @Output() onChange: EventEmitter<RangeCalendarUpdate> = new EventEmitter();

    dateRange = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
    });

    private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
    private readonly _intl = inject(MatDatepickerIntl);
    private readonly _locale = signal(inject<unknown>(LOCALE_ID));

    constructor(@Inject(LOCALE_ID) public activeLocale: string) {}

    updateFilters() {
        this.onChange.emit({
            start: this.dateRange.value.start,
            end: this.dateRange.value.end
        });
    }
}
