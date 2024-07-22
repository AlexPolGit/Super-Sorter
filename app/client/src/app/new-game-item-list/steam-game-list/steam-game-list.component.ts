import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { SteamGameFilter, SteamGameFilterSettings } from '../_filters/steam-game-filter';
import { ItemListComponent, SortableObjectChoice } from '../item-list.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SteamGameSortable } from 'src/app/_objects/sortables/steam-game';

@Component({
    selector: 'app-steam-game-list',
    templateUrl: './steam-game-list.component.html',
    styleUrl: './steam-game-list.component.scss'
})
export class SteamGameListComponent extends ItemListComponent {

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

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
        releaseDateRange: new FormGroup({
            start: new FormControl<Date | null>(null),
            end: new FormControl<Date | null>(null),
        }),
        minPlaytime: undefined,
        maxPlaytime: undefined
    };

    filteredDevelopers: string[] = [];
    filteredPublishers: string[] = [];
    filteredCategories: string[] = [];
    filteredGenres: string[] = [];

    constructor(
        public steamGameFilter: SteamGameFilter
    ) {
        super(steamGameFilter);
    }

    override ngOnChanges(changes: any) {
        super.ngOnChanges(changes);
        const filterableItems = this.getFilterableChoiceLists();
        this.filteredDevelopers = filterableItems.developers;
        this.filteredPublishers = filterableItems.publishers;
        this.filteredCategories = filterableItems.categories;
        this.filteredGenres = filterableItems.genres;
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
        return item.getDetailedDisplayName();
    }
}
