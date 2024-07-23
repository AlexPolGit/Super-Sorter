import { Component, Inject, LOCALE_ID, inject, signal } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { UserPreferenceService } from 'src/app/_services/user-preferences-service';
import { AnilistMediaFilter, AnilistMediaFilterSettings } from '../_filters/anilist-media-filter';
import { ItemListComponent } from '../item-list.component';
import { DateAdapter } from '@angular/material/core';
import { MatDatepickerIntl } from '@angular/material/datepicker';
import { ANILIST_AIRING_SEASONS, ANILIST_GENRES, ANILIST_MEDIA_FORMATS, ANILIST_TAGS } from 'src/app/_objects/sortables/anilist-media';
import { CheckboxDroplistUpdate } from '../_parts/checkbox-droplist/checkbox-droplist.component';
import { ChipDroplistUpdate } from '../_parts/chip-droplist/chip-droplist.component';
import { DoubleEndedSliderUpdate } from '../_parts/double-ended-slider/double-ended-slider.component';
import { DoubleEndedNumberInputUpdate } from '../_parts/double-ended-number-input/double-ended-number-input.component';
import { RangeCalendarUpdate } from '../_parts/range-calendar/range-calendar.component';
import { YearSeasonRangeUpdate } from '../_parts/year-season-range/year-season-range.component';

@Component({
    selector: 'app-anilist-media-list',
    templateUrl: './anilist-media-list.component.html',
    styleUrl: './anilist-media-list.component.scss'
})
export class AnilistMediaListComponent extends ItemListComponent {

    readonly userScoreFilterTitle: string = $localize`:@@new-game-anilist-list-user-score:User Score`;
    readonly meanScoreFilterTitle: string = $localize`:@@new-game-anilist-list-mean-score:Mean Score`;
    readonly ratedMediaOnly: string = $localize`:@@new-game-anilist-list-remove-no-score:Rated entries only?`;

    readonly favouritesTitle: string = $localize`:@@anilist-media-list-favourites:Favourites`;
    readonly favouritesMinLabel: string = $localize`:@@anilist-media-list-favourites-min:Min`;
    readonly favouritesMinPlaceholder: string = $localize`:@@anilist-media-list-favourites-min:Min`;
    readonly favouritesMaxLabel: string = $localize`:@@anilist-media-list-favourites-max:Max`;
    readonly favouritesMaxPlaceholder: string = $localize`:@@anilist-media-list-favourites-max:Max`;

    readonly formatsFilterTitle: string = $localize`:@@new-game-anilist-list-formats:Formats`;
    readonly formatsListLabel: string = $localize`:@@new-game-anilist-list-format-list:Format List`;

    readonly genresFilterTitle: string = $localize`:@@new-game-anilist-list-genres:Genres`;
    readonly genresFilterTypeLabel: string = $localize`:@@new-game-anilist-list-genre-and-or:Genre filter style:`;
    readonly genresListLabel: string = $localize`:@@new-game-anilist-list-genre-list:Genre List`;

    readonly tagsFilterTitle: string = $localize`:@@new-game-anilist-list-tags:Tags`;
    readonly tagsR18: string = $localize`:@@new-game-anilist-list-18up:R18?`;
    readonly tagsFilterTypeLabel: string = $localize`:@@new-game-anilist-list-tag-and-or:Tag filter style:`;
    readonly tagsListLabel: string = $localize`:@@new-game-anilist-list-tag-list:Tag List`;
    
    readonly startPeriodFilterTitle: string = $localize`:@@new-game-anilist-list-user-start-date:Start Period`;
    readonly endPeriodFilterTitle: string = $localize`:@@new-game-anilist-list-user-end-date:Completion Period`;

    readonly airingPeriodFilterTitle: string = $localize`:@@new-game-anilist-list-airing-season:Airing Season`;

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
        startDateRange: {
            start: null,
            end: null,
        },
        endDateRange: {
            start: null,
            end: null,
        },
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
    tagGenerator: () => string[] = () => {
        let tagList = this.showAdultTags ? ANILIST_TAGS : ANILIST_TAGS.filter(tag => !tag.isAdult);        
        return tagList.map((tag => tag.name));
    }

    constructor(public anilistMediaFilter: AnilistMediaFilter, private userPreferenceService: UserPreferenceService) {
        super(anilistMediaFilter);
    }

    updateUserScore(event: DoubleEndedSliderUpdate) {
        this.filters.userScore.min = event.smallValue;
        this.filters.userScore.max = event.largeValue;
        this.filters.userScore.hideNoScore = event.extraCheckbox;
        this.updateFilters();
    }

    updateMeanScore(event: DoubleEndedSliderUpdate) {
        this.filters.mediaScore.min = event.smallValue;
        this.filters.mediaScore.max = event.largeValue;
        this.filters.mediaScore.hideNoScore = event.extraCheckbox;
        this.updateFilters();
    }
    
    updateFavourites(event: DoubleEndedNumberInputUpdate) {
        this.filters.favourites.min = event.leftValue;
        this.filters.favourites.max = event.rightValue;
        this.updateFilters();
    }

    updateFormats(event: CheckboxDroplistUpdate) {
        this.filters.formats = event.options;
        this.updateFilters();
    }

    updateGenres(event: CheckboxDroplistUpdate) {
        this.filters.genres = event.options;
        this.filters.genreFilterType = event.type;
        this.updateFilters();
    }

    updateTags(event: ChipDroplistUpdate) {
        this.filters.tags = event.options;
        this.filters.genreFilterType = event.type;
        this.showAdultTags = event.extraCheckbox;
        this.updateFilters();
    }

    updateStartPeriod(event: RangeCalendarUpdate) {
        this.filters.startDateRange.start = event.start;
        this.filters.startDateRange.end = event.end;
        this.updateFilters();
    }

    updateEndPeriod(event: RangeCalendarUpdate) {
        this.filters.endDateRange.start = event.start;
        this.filters.endDateRange.end = event.end;
        this.updateFilters();
    }

    updateAiringRange(event: YearSeasonRangeUpdate) {
        this.filters.airing.min.year = event.minYear;
        this.filters.airing.min.season = event.minSeason;
        this.filters.airing.max.year = event.maxYear;
        this.filters.airing.max.season = event.maxSeason;
        this.updateFilters();
    }

    getItemDisplayName(item: SortableObject) {
        return item.getDetailedDisplayName(this.userPreferenceService.getAnilistLanguage());
    }
}
