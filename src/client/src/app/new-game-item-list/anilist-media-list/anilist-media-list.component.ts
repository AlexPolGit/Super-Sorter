import { Component, Inject, LOCALE_ID, inject, signal } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { UserPreferenceService } from 'src/app/_services/user-preferences-service';
import { AnilistMediaFilter, AnilistMediaFilterSettings } from '../_filters/anilist-media-filter';
import { ItemListComponent } from '../item-list.component';
import { FormGroup, FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ANILIST_GENRES, ANILIST_TAGS } from 'src/app/_objects/sortables/anilist-media';

@Component({
    selector: 'app-anilist-media-list',
    templateUrl: './anilist-media-list.component.html',
    styleUrl: './anilist-media-list.component.scss'
})
export class AnilistMediaListComponent extends ItemListComponent {

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

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
        }),
        genres: [],
        tags: new Set<string>()
    };

    userScoreMin: number = 0;
    userScoreMax: number = 100;
    genreList: string[] = ANILIST_GENRES;
    filteredTags: string[] = ANILIST_TAGS;
    currentTag: string = "";

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

    filterTags(tagValue: string) {
        this.filteredTags = ANILIST_TAGS.filter(tag => tag.toLocaleUpperCase().includes(tagValue.toLocaleUpperCase()));
    }

    addTag(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (ANILIST_TAGS.includes(value)) {
            this.filters.tags.add(value);
        }
        this.currentTag = "";
    }

    removeTag(toRemove: string): void {
        this.filters.tags.delete(toRemove);
    }

    selectTag(event: MatAutocompleteSelectedEvent): void {
        this.filters.tags.add(event.option.viewValue);
        this.currentTag = "";
        event.option.deselect();
        this.filterTags("");
    }
}
