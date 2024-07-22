import { Pipe } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserPreferenceService } from 'src/app/_services/user-preferences-service';
import { FilterSettings, ItemListFilter } from './item-list-filter';
import { SortableObjectChoice } from '../item-list.component';
import { SteamGameSortable } from 'src/app/_objects/sortables/steam-game';

export interface SteamGameFilterSettings extends FilterSettings {
    developers: Set<string>;
    publishers: Set<string>;
    platforms: {
        windows: boolean;
        mac: boolean;
        linux: boolean;
    };
    categories: Set<string>;
    categoriesFilterType: "or" | "and";
    genres: Set<string>;
    genresFilterType: "or" | "and";
    releaseDateRange: FormGroup<{
        start: FormControl<Date | null>;
        end: FormControl<Date | null>;
    }>;
    lastPlayed: FormGroup<{
        minimum: FormControl<Date | null>;
    }>;
    minPlaytime?: number;
    maxPlaytime?: number;
}

@Pipe({
    name: 'steamGameFilter',
    pure: false
})
export class SteamGameFilter extends ItemListFilter {

    constructor(public userPreferenceService: UserPreferenceService) {
        super();
    }

    override transform(gameList: SortableObjectChoice<SteamGameSortable>[], filter: SteamGameFilterSettings) {
        if (!gameList || !filter) {
            return gameList;
        }

        let games = gameList.filter((item: SortableObjectChoice<SteamGameSortable>) => {
            let game: SteamGameSortable = item.item;

            if (game.developers && filter.developers.size > 0) {
                let hasDeveloper: boolean = false;
                for (const tag of filter.developers) {
                    if (game.developers.find(developer => developer === tag)) {
                        hasDeveloper = true;
                        break;
                    }
                }
                
                if (!hasDeveloper) {
                    return false;
                }
            }

            if (game.publishers && filter.publishers.size > 0) {
                let hasPublisher: boolean = false;
                for (const tag of filter.publishers) {
                    if (game.publishers.find(publisher => publisher === tag)) {
                        hasPublisher = true;
                        break;
                    }
                }
                
                if (!hasPublisher) {
                    return false;
                }
            }

            if (game.platforms) {
                if (filter.platforms.windows && !game.platforms.windows) {
                    return false;
                }
                if (filter.platforms.mac && !game.platforms.mac) {
                    return false;
                }
                if (filter.platforms.linux && !game.platforms.linux) {
                    return false;
                }
            }

            if (game.categories && filter.categories.size > 0) {

                if (filter.categoriesFilterType === "and") {
                    for (const category of filter.categories) {
                        if (!game.categories.find(gameCategory => gameCategory === category)) {
                            return false;
                        }
                    }
                }
                else {
                    let hasCategory: boolean = false;

                    for (const category of filter.categories) {
                        if (game.categories.find(gameCategory => gameCategory === category)) {
                            hasCategory = true;
                            break;
                        }
                    }
                    
                    if (!hasCategory) {
                        return false;
                    }
                }
            }

            if (game.genres && filter.genres.size > 0) {

                if (filter.genresFilterType === "and") {
                    for (const genre of filter.genres) {
                        if (!game.genres.find(gameGenre => gameGenre === genre)) {
                            return false;
                        }
                    }
                }
                else {
                    let hasGenre: boolean = false;

                    for (const genre of filter.genres) {
                        if (game.genres.find(gameGenre => gameGenre === genre)) {
                            hasGenre = true;
                            break;
                        }
                    }
                    
                    if (!hasGenre) {
                        return false;
                    }
                }
            }

            if (game.releaseDate) {
                if (
                    filter.releaseDateRange.value.start &&
                    game.releaseDate < filter.releaseDateRange.value.start.getTime()
                ) {
                    return false;
                }

                if (
                    filter.releaseDateRange.value.end &&
                    game.releaseDate > filter.releaseDateRange.value.end.getTime()
                ) {
                    return false;
                }
            }
            else if (filter.releaseDateRange.value.start || filter.releaseDateRange.value.end) {
                return false;
            }

            if (game.userDetails?.lastPlayed) {
                if (
                    filter.lastPlayed.value.minimum &&
                    game.userDetails.lastPlayed < filter.lastPlayed.value.minimum.getTime()
                ) {
                    return false;
                }
            }
            else if (filter.lastPlayed.value.minimum) {
                return false;
            }

            if (game.userDetails?.playtime) {
                if (filter.minPlaytime && filter.minPlaytime < game.userDetails.playtime) {
                    return false;
                }
                
                if (filter.maxPlaytime && filter.maxPlaytime > game.userDetails.playtime) {
                    return false;
                }
            }

            return true;
        });

        return games.sort(
            (itemA: SortableObjectChoice<SteamGameSortable>, itemB: SortableObjectChoice<SteamGameSortable>) => {
                return itemA.item.getDisplayName().localeCompare(itemB.item.getDisplayName());
            }
        );
    }
}