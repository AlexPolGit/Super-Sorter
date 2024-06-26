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
import { ANILIST_AIRING_SEASONS, ANILIST_GENRES, ANILIST_MEDIA_FORMATS, ANILIST_TAGS } from 'src/app/_objects/sortables/anilist-media';

@Component({
    selector: 'app-anilist-media-list',
    templateUrl: './anilist-media-list.component.html',
    styleUrl: './anilist-media-list.component.scss'
})
export class AnilistMediaListComponent extends ItemListComponent {

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    
    readonly CURRENT_YEAR = new Date().getFullYear();
    readonly MIN_YEAR = 1900;
    readonly MAX_YEAR = this.CURRENT_YEAR + 2;

    readonly MIN_CALENDAR_DATE = new Date(this.MIN_YEAR, 0, 1);
    readonly MAX_CALENDAR_DATE = new Date(this.MAX_YEAR, 11, 31);

    override filters: AnilistMediaFilterSettings = {
        userScore: {
            min: 0,
            max: 10,
            hideNoScore: false
        },
        mediaScore: {
            min: 0,
            max: 10,
            hideNoScore: false
        },
        favourites: {
            min: undefined,
            max: undefined
        },
        startDateRange: new FormGroup({
            start: new FormControl<Date | null>(null),
            end: new FormControl<Date | null>(null),
        }),
        endDateRange: new FormGroup({
            start: new FormControl<Date | null>(null),
            end: new FormControl<Date | null>(null),
        }),
        genres: [],
        genreFilterType: "and",
        tags: new Set<string>(),
        tagFilterType: "and",
        formats: [],
        airing: {
            min: {
                year: undefined,
                season: undefined
            },
            max: {
                year: undefined,
                season: undefined
            }
        }
    };

    formatList: { value: string; displayName: string; }[] = ANILIST_MEDIA_FORMATS;
    seasonList: { value: string; displayName: string; }[] = ANILIST_AIRING_SEASONS;
    genreList: { value: string; displayName: string; }[] = ANILIST_GENRES;
    showAdultTags: boolean = false;
    filteredTags: string[] = this.getTagList();
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

    getTagList(): string[] {
        let tagList = this.showAdultTags ? ANILIST_TAGS : ANILIST_TAGS.filter(tag => !tag.isAdult);        
        return tagList.map((tag => tag.name));
    }

    getItemDisplayName(item: SortableObject) {
        return item.getDetailedDisplayName(this.userPreferenceService.getAnilistLanguage());
    }

    filterTags(tagValue: string) {
        this.filteredTags = this.getTagList().filter(tag => tag.toLocaleUpperCase().includes(tagValue.toLocaleUpperCase()));
    }

    addTag(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (this.getTagList().includes(value)) {
            this.filters.tags.add(value);
            this.currentTag = "";
            this.updateFilters();
        }
    }

    removeTag(toRemove: string): void {
        this.filters.tags.delete(toRemove);
        this.updateFilters();
    }

    selectTag(event: MatAutocompleteSelectedEvent): void {
        this.filters.tags.add(event.option.viewValue);
        this.currentTag = "";
        event.option.deselect();
        this.filterTags("");
        this.updateFilters();
    }
}
