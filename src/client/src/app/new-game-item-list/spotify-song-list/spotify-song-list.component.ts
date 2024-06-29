import { Component } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { SpotifySongFilter, SpotifySongFilterSettings } from '../_filters/spotify-song-filter';
import { ItemListComponent, SortableObjectChoice } from '../item-list.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SpotifySongSortable } from 'src/app/_objects/sortables/spotify-song';
import { SpotifyArtistSortable } from 'src/app/_objects/sortables/spotify-artist';

@Component({
    selector: 'app-spotify-song-list',
    templateUrl: './spotify-song-list.component.html',
    styleUrl: './spotify-song-list.component.scss'
})
export class SpotifySongListComponent extends ItemListComponent {

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    override filters: SpotifySongFilterSettings = {
        showLocal: true,
        showExplicit: true,
        duration: {
            min: undefined,
            max: undefined
        },
        artists: new Set<SpotifyArtistSortable>()
    };

    allArtists: Map<string, SpotifyArtistSortable> = new Map();
    filteredArtists: SpotifyArtistSortable[] = [];
    currentArtistName: string = "";

    constructor(
        public spotifySongFilter: SpotifySongFilter
    ) {
        super(spotifySongFilter);
    }

    override ngOnChanges(changes: any) {
        super.ngOnChanges(changes);
        this.filteredArtists = this.getArtistList();
    }

    getItemDisplayName(item: SortableObject) {
        return item.getDetailedDisplayName();
    }

    getArtistByName(name: string): SpotifyArtistSortable | null {
        for (let artist of this.filteredArtists) {
            if (artist.name === name) {
                return artist;
            }
        }
        return null;
    }

    getArtistList(): SpotifyArtistSortable[] {   
        let artists = new Set<SpotifyArtistSortable>();
        this.startingItems.forEach((item: SortableObjectChoice<SortableObject>) => {
            let albumArtists = (item.item as SpotifySongSortable).artists;
            albumArtists.forEach(artist => artists.add(artist));
        });
        
        return Array.from(artists).sort(
            (itemA: SpotifyArtistSortable, itemB: SpotifyArtistSortable) => {
                return itemA.getDisplayName().localeCompare(itemB.getDisplayName());
            }
        );
    }

    filterArtists(nameFilter: string) {
        if (typeof(nameFilter) !== "string") {
            nameFilter = "";
        }
        this.filteredArtists = this.getArtistList().filter(artist => artist.name.toLocaleUpperCase().includes(nameFilter.toLocaleUpperCase()));
    }

    addArtist(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        let artist = this.getArtistByName(value);
        if (artist) {
            this.filters.artists.add(artist);
            this.currentArtistName = "";
            this.updateFilters();
        }
    }

    removeArtist(toRemove: SpotifyArtistSortable): void {
        this.filters.artists.delete(toRemove);
        this.updateFilters();
    }

    selectArtist(event: MatAutocompleteSelectedEvent): void {
        let artist = this.getArtistByName(event.option.viewValue);
        if (artist) {
            this.filters.artists.add(artist);
            this.currentArtistName = "";
            this.filterArtists("");
            this.updateFilters();
        }
    }
}
