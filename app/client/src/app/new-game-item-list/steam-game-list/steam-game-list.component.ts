import { Component } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { SteamGameFilter, SteamGameFilterSettings } from '../_filters/steam-game-filter';
import { ItemListComponent } from '../item-list.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
    selector: 'app-steam-game-list',
    templateUrl: './steam-game-list.component.html',
    styleUrl: './steam-game-list.component.scss'
})
export class SteamGameListComponent extends ItemListComponent {

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    override filters: SteamGameFilterSettings = {};

    constructor(
        public steamGameFilter: SteamGameFilter
    ) {
        super(steamGameFilter);
    }

    getItemDisplayName(item: SortableObject) {
        return item.getDetailedDisplayName();
    }
}
