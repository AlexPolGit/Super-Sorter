import { Component, Inject, LOCALE_ID, inject, signal } from '@angular/core';
import { AnilistMediaSortable } from 'src/app/_objects/sortables/anilist-media';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { UserPreferenceService } from 'src/app/_services/user-preferences-service';
import { AnilistMediaFilter, AnilistMediaFilterSettings } from '../_filters/anilist-media-filter';
import { ItemListComponent } from '../item-list.component';
import { FormGroup, FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';

@Component({
    selector: 'app-anilist-media-list',
    templateUrl: './anilist-media-list.component.html',
    styleUrl: './anilist-media-list.component.scss'
})
export class AnilistMediaListComponent extends ItemListComponent {

    override filters: AnilistMediaFilterSettings = {
        userScoreMin: 0,
        userScoreMax: 100,
        startDateRange: new FormGroup({
            start: new FormControl<Date | null>(null),
            end: new FormControl<Date | null>(null),
        }),
        endDateRange: new FormGroup({
            start: new FormControl<Date | null>(null),
            end: new FormControl<Date | null>(null),
        })
    };

    userScoreMin: number = 0;
    userScoreMax: number = 100;

    private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
    private readonly _intl = inject(MatDatepickerIntl);
    private readonly _locale = signal(inject<unknown>(LOCALE_ID));

    constructor(
        public anilistMediaFilter: AnilistMediaFilter,
        private userPreferenceService: UserPreferenceService,
        @Inject(LOCALE_ID) public activeLocale: string
    ) {
        super(anilistMediaFilter);
    }

    getItemDisplayName(item: SortableObject) {
        return item.getDetailedDisplayName(this.userPreferenceService.getAnilistLanguage());
    }
}
