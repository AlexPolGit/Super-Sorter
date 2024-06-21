import { Component } from '@angular/core';
import { SpotifySongSortable } from 'src/app/_objects/sortables/spotify-song';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { SpotifySongFilter, SpotifySongFilterSettings } from '../filters/spotify-song-filter';
import { ItemListComponent } from '../item-list.component';

@Component({
    selector: 'app-spotify-song-list',
    templateUrl: './spotify-song-list.component.html',
    styleUrl: './spotify-song-list.component.scss'
})
export class SpotifySongListComponent extends ItemListComponent<SpotifySongSortable> {

    override filters: SpotifySongFilterSettings = {};

    constructor(
        public spotifySongFilter: SpotifySongFilter
    ) {
        super(spotifySongFilter);
    }

    getItemDisplayName(item: SortableObject) {
        return item.getDetailedDisplayName();
    }
}
