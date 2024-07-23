import { Component, Inject, LOCALE_ID } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { SteamGameFilter, SteamGameFilterSettings } from '../_filters/steam-game-filter';
import { ItemListComponent, SortableObjectChoice } from '../item-list.component';
import { SteamGameSortable } from 'src/app/_objects/sortables/steam-game';
import { ChipDroplistUpdate } from '../_parts/chip-droplist/chip-droplist.component';
import { CheckboxGridUpdate } from '../_parts/checkbox-grid/checkbox-grid.component';
import { RangeCalendarUpdate } from '../_parts/range-calendar/range-calendar.component';
import { DoubleEndedNumberInputUpdate } from '../_parts/double-ended-number-input/double-ended-number-input.component';
import { UserPreferenceService } from 'src/app/_services/user-preferences-service';

@Component({
    selector: 'app-steam-game-list',
    templateUrl: './steam-game-list.component.html',
    styleUrl: './steam-game-list.component.scss'
})
export class SteamGameListComponent extends ItemListComponent {

    readonly developersFilterTitle: string = $localize`:@@new-game-steam-games-developers:Developers`;
    readonly developersListLabel: string = $localize`:@@new-game-steam-games-developers-list:Developer List`;

    readonly publishersFilterTitle: string = $localize`:@@new-game-steam-games-publishers:Publishers`;
    readonly publishersListLabel: string = $localize`:@@new-game-steam-games-publishers-list:Publisher List`;

    readonly categoryFilterTitle: string = $localize`:@@new-game-steam-games-category:Categories`;
    readonly categoryListLabel: string = $localize`:@@new-game-steam-games-category-list:Category List`;
    readonly categoryFilterTypeLabel: string = $localize`:@@new-game-steam-games-category-and-or:Category filter style:`;

    readonly genreFilterTitle: string = $localize`:@@new-game-steam-games-genre:Genres`;
    readonly genreListLabel: string = $localize`:@@new-game-steam-games-genre-list:Genre List`;
    readonly genreFilterTypeLabel: string = $localize`:@@new-game-steam-games-genre-and-or:Genre filter style:`;

    readonly platformFilterTitle: string = $localize`:@@steam-games-list-platforms:Platforms`;
    readonly platformOptions: string[] = [
        $localize`:@@steam-games-list-platforms-windows:Windows`,
        $localize`:@@steam-games-list-platforms-mac:Mac`,
        $localize`:@@steam-games-list-platforms-linux:Linux`
    ];

    readonly playtimeFilterTitle: string = $localize`:@@game-steam-list-playtime:Playtime`;
    readonly playtimeMinLabel: string = $localize`:@@game-steam-list-playtime-min:Min`;
    readonly playtimeMinPlaceholder: string = $localize`:@@game-steam-list-playtime-min:Min`;
    readonly playtimeMaxLabel: string = $localize`:@@game-steam-list-playtime-max:Max`;
    readonly playtimeMaxPlaceholder: string = $localize`:@@game-steam-list-playtime-max:Max`;

    readonly releaseDateFilterTitle: string = $localize`:@@new-game-steam-games-release-date:Release Date`;

    readonly CURRENT_YEAR = new Date().getFullYear();
    readonly MIN_YEAR = 1950;
    readonly MAX_YEAR = this.CURRENT_YEAR + 5;
    readonly MIN_CALENDAR_DATE = new Date(this.MIN_YEAR, 0, 1);
    readonly MAX_CALENDAR_DATE = new Date(this.MAX_YEAR, 11, 31);

    override filters: SteamGameFilterSettings = {
        developers: new Set<string>(),
        publishers: new Set<string>(),
        platforms: {
            windows: false,
            mac: false,
            linux: false
        },
        categories: new Set<string>(),
        categoriesFilterType: "and",
        genres: new Set<string>(),
        genresFilterType: "and",
        releaseDateRange: {
            start: null,
            end: null,
        },
        minPlaytime: undefined,
        maxPlaytime: undefined
    };

    developerGenerator: () => string[] = () => [];
    publisherGenerator: () => string[] = () => [];
    categoryGenerator: () => string[] = () => [];
    genreGenerator: () => string[] = () => [];
    
    constructor(public steamGameFilter: SteamGameFilter, @Inject(LOCALE_ID) public activeLocale: string) {
        super(steamGameFilter);
    }

    override ngOnChanges(changes: any) {
        super.ngOnChanges(changes);
        const filterableItems = this.getFilterableChoiceLists();
        this.developerGenerator = () => filterableItems.developers;
        this.publisherGenerator = () => filterableItems.publishers;
        this.categoryGenerator = () => filterableItems.categories;
        this.genreGenerator = () => filterableItems.genres;
    }

    getFilterableChoiceLists() {   
        let developers: Set<string> = new Set();
        let publishers: Set<string> = new Set();
        let categories: Set<string> = new Set();
        let genres: Set<string> = new Set();
        
        this.startingItems.forEach((item: SortableObjectChoice<SortableObject>) => {
            const game = (item.item as SteamGameSortable);

            game.developers?.forEach(developer => developers.add(developer));
            game.publishers?.forEach(publisher => publishers.add(publisher));
            game.categories?.forEach(category => categories.add(category));
            game.genres?.forEach(genre => genres.add(genre));
        });
        
        return {
            developers: Array.from(developers.values()).sort((itemA, itemB) => itemA.localeCompare(itemB)),
            publishers: Array.from(publishers.values()).sort((itemA, itemB) => itemA.localeCompare(itemB)),
            categories: Array.from(categories.values()).sort((itemA, itemB) => itemA.localeCompare(itemB)),
            genres: Array.from(genres.values()).sort((itemA, itemB) => itemA.localeCompare(itemB))
        };
    }

    getItemDisplayName(item: SortableObject) {
        return item.getDetailedDisplayName(this.activeLocale);
    }

    updateDevelopers(event: ChipDroplistUpdate) {
        this.filters.developers = event.options;
        this.updateFilters();
    }

    updatePublishers(event: ChipDroplistUpdate) {
        this.filters.publishers = event.options;
        this.updateFilters();
    }

    updateCategories(event: ChipDroplistUpdate) {
        this.filters.categories = event.options;
        this.filters.categoriesFilterType = event.type;
        this.updateFilters();
    }

    updateGenres(event: ChipDroplistUpdate) {
        this.filters.genres = event.options;
        this.filters.genresFilterType = event.type;
        this.updateFilters();
    }
    
    updatePlatforms(event: CheckboxGridUpdate) {
        this.filters.platforms.windows = event.values[0];
        this.filters.platforms.mac = event.values[1];
        this.filters.platforms.linux = event.values[2];
        this.updateFilters();
    }

    updateReleaseDate(event: RangeCalendarUpdate) {
        this.filters.releaseDateRange.start = event.start;
        this.filters.releaseDateRange.end = event.end;
        this.updateFilters();
    }

    updatePlaytime(event: DoubleEndedNumberInputUpdate) {
        this.filters.minPlaytime = event.leftValue;
        this.filters.maxPlaytime = event.rightValue;
        this.updateFilters();
    }
}
