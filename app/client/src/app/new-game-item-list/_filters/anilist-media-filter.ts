import { Pipe } from '@angular/core';
import { ANILIST_AIRING_SEASONS, AnilistMediaSortable, anilistDateToDate } from 'src/app/_objects/sortables/anilist-media';
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
    startDateRange: {
        start?: Date | null;
        end?: Date | null;
    };
    endDateRange: {
        start?: Date | null;
        end?: Date | null;
    };
    genres: { value: string; displayName: string; }[];
    genreFilterType: "or" | "and";
    tags: Set<string>;
    tagFilterType: "or" | "and";
    formats: { value: string; displayName: string; }[];
    airing: {
        min: {
            year?: number;
            season?: string
        }
        max: {
            year?: number;
            season?: string
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

            const userStartedAt = anilistDateToDate(media.userData.startedAt);
            if (userStartedAt) {
                if (
                    filter.startDateRange.start &&
                    userStartedAt < filter.startDateRange.start.getTime()
                ) {
                    return false;
                }

                if (
                    filter.startDateRange.end &&
                    userStartedAt > filter.startDateRange.end.getTime()
                ) {
                    return false;
                }
            }
            else if (filter.startDateRange.start || filter.startDateRange.end) {
                return false;
            }

            const userCompletedAt = anilistDateToDate(media.userData.completedAt);
            if (userCompletedAt) {
                if (
                    filter.endDateRange.start &&
                    userCompletedAt < filter.endDateRange.start.getTime()
                ) {
                    return false;
                }

                if (
                    filter.endDateRange.end &&
                    userCompletedAt > filter.endDateRange.end.getTime()
                ) {
                    return false;
                }
            }
            else if (filter.endDateRange.start || filter.endDateRange.end) {
                return false;
            }

            if (media.seasonYear) {
                if (filter.airing.min.year && media.seasonYear < filter.airing.min.year) {
                    return false;
                }
                else if (filter.airing.min.year && media.seasonYear === filter.airing.min.year) {
                    if (filter.airing.min.season) {
                        // Possible values: 0-3 or -1 if missing.
                        let mediaSeasonValue = ANILIST_AIRING_SEASONS.findIndex(season => season.value === media.season);
                        // Possible values: 0-3.
                        let filterSeasonvalue = ANILIST_AIRING_SEASONS.findIndex(season => season.value === filter.airing.min.season);

                        if (mediaSeasonValue === -1) {
                            return false;
                        }
                        else if (mediaSeasonValue < filterSeasonvalue) {
                            return false;
                        }
                    }
                }

                if (filter.airing.max.year && media.seasonYear > filter.airing.max.year) {
                    return false;
                }
                else if (filter.airing.max.year && media.seasonYear === filter.airing.max.year) {
                    if (filter.airing.max.season) {
                        // Possible values: 0-3 or -1 if missing.
                        let mediaSeasonValue = ANILIST_AIRING_SEASONS.findIndex(season => season.value === media.season);
                        // Possible values: 0-3.
                        let filterSeasonvalue = ANILIST_AIRING_SEASONS.findIndex(season => season.value === filter.airing.max.season);
                        
                        if (mediaSeasonValue === -1) {
                            return false;
                        }
                        else if (mediaSeasonValue > filterSeasonvalue) {
                            return false;
                        }
                    }
                }
            }
            else if (filter.airing.min.year || filter.airing.min.season || filter.airing.max.year || filter.airing.max.season) {
                return false;
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