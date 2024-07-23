import { Component } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { SpotifySongFilter, SpotifySongFilterSettings } from '../_filters/spotify-song-filter';
import { ItemListComponent, SortableObjectChoice } from '../item-list.component';
import { SpotifySongSortable } from 'src/app/_objects/sortables/spotify-song';
import { SpotifyArtistSortable } from 'src/app/_objects/sortables/spotify-artist';
import { CheckboxGridUpdate } from '../_parts/checkbox-grid/checkbox-grid.component';
import { DoubleEndedNumberInputUpdate } from '../_parts/double-ended-number-input/double-ended-number-input.component';
import { ChipDroplistUpdate } from '../_parts/chip-droplist/chip-droplist.component';

@Component({
    selector: 'app-spotify-song-list',
    templateUrl: './spotify-song-list.component.html',
    styleUrl: './spotify-song-list.component.scss'
})
export class SpotifySongListComponent extends ItemListComponent {

    readonly songMetaFilterTitle: string = $localize`:@@spotify-song-list-metadata:Song Metadata`;
    readonly metaOptions: string[] = [
        $localize`:@@spotify-song-list-local-song:Local`,
        $localize`:@@spotify-song-list-expicit-song:Explicit`
    ];

    readonly durationFilterTitle: string = $localize`:@@spotify-song-list-duration:Duration (Sec)`;
    readonly durationMinLabel: string = $localize`:@@spotify-song-list-duration-min:Min`;
    readonly durationMinPlaceholder: string = $localize`:@@spotify-song-list-duration-min:Min`;
    readonly durationMaxLabel: string = $localize`:@@spotify-song-list-duration-max:Max`;
    readonly durationMaxPlaceholder: string = $localize`:@@spotify-song-list-duration-max:Max`;

    readonly artistsFilterTitle: string = $localize`:@@spotify-song-list-artists:Artists`;
    readonly artistsListLabel: string = $localize`:@@spotify-song-artist-list:Artist List`;

    override filters: SpotifySongFilterSettings = {
        showLocal: true,
        showExplicit: true,
        duration: {
            min: undefined,
            max: undefined
        },
        artists: new Set<string>()
    };

    artistGenerator: () => SpotifyArtistSortable[] = () => [];

    artistStringValue: (item: string | SpotifyArtistSortable) => string = (artist) => {
        if (artist instanceof SpotifyArtistSortable) {
            return artist.name;
        }
        else {
            return artist;
        }
    }

    constructor(public spotifySongFilter: SpotifySongFilter) {
        super(spotifySongFilter);
    }

    override ngOnChanges(changes: any) {
        super.ngOnChanges(changes);
        this.artistGenerator = () => {
            let artists: { [id: string]: SpotifyArtistSortable } = {};
            this.startingItems.forEach((item: SortableObjectChoice<SortableObject>) => {
                let albumArtists = (item.item as SpotifySongSortable).artists;
                albumArtists.forEach(artist => artists[artist.id] = artist);
            });
            
            return Object.entries(artists).map(artist => artist[1]).sort(
                (itemA: SpotifyArtistSortable, itemB: SpotifyArtistSortable) => {
                    return itemA.getDisplayName().localeCompare(itemB.getDisplayName());
                }
            );
        };
    }

    getItemDisplayName(item: SortableObject) {
        return item.getDetailedDisplayName();
    }

    updateMeta(event: CheckboxGridUpdate) {
        this.filters.showLocal = event.values[0];
        this.filters.showExplicit = event.values[1];
        this.updateFilters();
    }

    updateDuration(event: DoubleEndedNumberInputUpdate) {
        this.filters.duration.min = event.leftValue;
        this.filters.duration.max = event.rightValue;
        this.updateFilters();
    }

    updateArtists(event: ChipDroplistUpdate) {
        console.log(event);
        this.filters.artists = event.options;
        this.updateFilters();
    }
}
