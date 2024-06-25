import { Pipe } from '@angular/core';
import { AnilistMediaSortable, anilistDateToDate } from 'src/app/_objects/sortables/anilist-media';
import { UserPreferenceService } from 'src/app/_services/user-preferences-service';
import { FilterSettings, ItemListFilter } from './item-list-filter';
import { SortableObjectChoice } from '../item-list.component';
import { FormControl, FormGroup } from '@angular/forms';

export interface AnilistMediaFilterSettings extends FilterSettings {
    userScore: {
        min: number;
        max: number;
        hideNoScore: boolean;
    };
    mediaScore: {
        min: number;
        max: number;
        hideNoScore: boolean;
    };
    favourites: {
        min?: number;
        max?: number;
    };
    startDateRange: FormGroup<{
        start: FormControl<Date | null>;
        end: FormControl<Date | null>;
    }>;
    endDateRange: FormGroup<{
        start: FormControl<Date | null>;
        end: FormControl<Date | null>;
    }>;
    genres: { value: string; displayName: string; }[];
    genreFilterType: "or" | "and";
    tags: Set<string>;
    tagFilterType: "or" | "and";
    formats: { value: string; displayName: string; }[];
    airing: {
        seasons: { value: string; displayName: string; }[];
        year: {
            min: number;
            max: number;
        }
    }
}

@Pipe({
    name: 'anilistMediaFilter',
    pure: false
})
export class AnilistMediaFilter extends ItemListFilter {

    constructor(public userPreferenceService: UserPreferenceService) {
        super();
    }

    override transform(media: SortableObjectChoice<AnilistMediaSortable>[], filter: AnilistMediaFilterSettings) {
        if (!media || !filter) {
            return media;
        }

        let filteredMedia = media.filter((item: SortableObjectChoice<AnilistMediaSortable>) => {
            let media: AnilistMediaSortable = item.item;

            if (media.meanScore) {
                if (filter.mediaScore.min && media.meanScore < filter.mediaScore.min) {
                    return false;
                }

                if (filter.mediaScore.max && media.meanScore > filter.mediaScore.max) {
                    return false;
                }
            }
            if (filter.mediaScore.hideNoScore && !media.meanScore) {
                return false;
            }
        
            if (media.userData.score) {
                if (filter.userScore.min && media.userData.score < filter.userScore.min) {
                    return false;
                }

                if (filter.userScore.max && media.userData.score > filter.userScore.max) {
                    return false;
                }
            }
            if (filter.userScore.hideNoScore && !media.userData.score) {
                return false;
            }

            if (media.favourites) {
                if (filter.favourites.min && media.favourites < filter.favourites.min) {
                    return false;
                }

                if (filter.favourites.max && media.favourites > filter.favourites.max) {
                    return false;
                }
            }
            else if (filter.favourites.min || filter.favourites.max) {
                return false;
            }

            if (media.format && filter.formats.length > 0) {
                let isFormat: boolean = false;

                for (let i = 0; i < filter.formats.length; i++) {
                    if (media.format === filter.formats[i].value) {
                        isFormat = true;
                        break;
                    }
                }
                
                if (!isFormat) {
                    return false;
                }
            }

            if (media.genres && filter.genres.length > 0) {

                if (filter.genreFilterType === "and") {
                    for (let i = 0; i < filter.genres.length; i++) {
                        if (!media.genres.find(mediaGenre => mediaGenre === filter.genres[i].value)) {
                            return false;
                        }
                    }
                }
                else {
                    let hasGenre: boolean = false;

                    for (let i = 0; i < filter.genres.length; i++) {
                        if (media.genres.find(mediaGenre => mediaGenre === filter.genres[i].value)) {
                            hasGenre = true;
                            break;
                        }
                    }
                    
                    if (!hasGenre) {
                        return false;
                    }
                }
            }

            if (media.tags && filter.tags.size > 0) {

                if (filter.genreFilterType === "and") {
                    for (const tag of filter.tags) {
                        if (!media.tags.find(mediaGenre => mediaGenre === tag)) {
                            return false;
                        }
                    }
                }
                else {
                    let hasTag: boolean = false;

                    for (const tag of filter.tags) {
                        if (media.tags.find(mediaGenre => mediaGenre === tag)) {
                            hasTag = true;
                            break;
                        }
                    }
                    
                    if (!hasTag) {
                        return false;
                    }
                }
            }

            if (media.userData.startedAt) {
                if (
                    filter.startDateRange.value.start &&
                    anilistDateToDate(media.userData.startedAt) < filter.startDateRange.value.start.getTime()
                ) {
                    return false;
                }

                if (
                    filter.startDateRange.value.end &&
                    anilistDateToDate(media.userData.startedAt) > filter.startDateRange.value.end.getTime()
                ) {
                    return false;
                }
            }
            else if (filter.startDateRange.value.start || filter.startDateRange.value.end) {
                return false;
            }

            if (media.userData.completedAt) {
                if (
                    filter.endDateRange.value.start &&
                    anilistDateToDate(media.userData.completedAt) < filter.endDateRange.value.start.getTime()
                ) {
                    return false;
                }

                if (
                    filter.endDateRange.value.end &&
                    anilistDateToDate(media.userData.completedAt) > filter.endDateRange.value.end.getTime()
                ) {
                    return false;
                }
            }
            else if (filter.endDateRange.value.start || filter.endDateRange.value.end) {
                return false;
            }

            if (media.seasonYear) {
                if (filter.airing.year.min && media.seasonYear < filter.airing.year.min) {
                    return false;
                }

                if (filter.airing.year.max && media.seasonYear > filter.airing.year.max) {
                    return false;
                }
            }

            if (media.season && filter.airing.seasons.length > 0) {
                let isSeason: boolean = false;

                for (let i = 0; i < filter.airing.seasons.length; i++) {
                    if (media.season === filter.airing.seasons[i].value) {
                        isSeason = true;
                        break;
                    }
                }
                
                if (!isSeason) {
                    return false;
                }
            }
 
            return true;
        });

        return filteredMedia.sort(
            (itemA: SortableObjectChoice<AnilistMediaSortable>, itemB: SortableObjectChoice<AnilistMediaSortable>) => {
                return itemA.item.getDisplayName(this.userPreferenceService.getAnilistLanguage())
                    .localeCompare(itemB.item.getDisplayName(this.userPreferenceService.getAnilistLanguage()));
            }
        );
    }
}