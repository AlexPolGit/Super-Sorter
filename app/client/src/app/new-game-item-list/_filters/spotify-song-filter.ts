import { Pipe } from '@angular/core';
import { SpotifySongSortable } from 'src/app/_objects/sortables/spotify-song';
import { UserPreferenceService } from 'src/app/_services/user-preferences-service';
import { FilterSettings, ItemListFilter } from './item-list-filter';
import { SortableObjectChoice } from '../item-list.component';
import { SpotifyArtistSortable } from 'src/app/_objects/sortables/spotify-artist';

export interface SpotifySongFilterSettings extends FilterSettings {
    showLocal: boolean;
    showExplicit: boolean;
    duration: {
        min?: number;
        max?: number;
    };
    artists: Set<SpotifyArtistSortable>;
}

@Pipe({
    name: 'spotifySongFilter',
    pure: false
})
export class SpotifySongFilter extends ItemListFilter {

    constructor(public userPreferenceService: UserPreferenceService) {
        super();
    }

    override transform(songList: SortableObjectChoice<SpotifySongSortable>[], filter: SpotifySongFilterSettings) {
        if (!songList || !filter) {
            return songList;
        }

        let songs = songList.filter((item: SortableObjectChoice<SpotifySongSortable>) => {
            let song: SpotifySongSortable = item.item;
        
            if (filter.showLocal !== undefined && filter.showLocal === false && song.local) {
                return false;
            }

            if (filter.showExplicit !== undefined && filter.showExplicit === false && song.explicit) {
                return false;
            }

            if (song.duration) {
                let durationSeconds = Math.round(song.duration / 1000);

                if (
                    (filter.duration.min && durationSeconds < filter.duration.min) ||
                    (filter.duration.max && durationSeconds > filter.duration.max)
                ) {
                    return false;
                }
            }
            else if ((filter.duration.min || filter.duration.max) && (song.duration === -1)) {
                return false;
            }

            if (song.artists.length > 0 && filter.artists.size > 0) {
                let hasArtist: boolean = false;

                for (const artist of filter.artists) {
                    if (song.artists.find(a => a.id === artist.id)) {
                        hasArtist = true;
                        break;
                    }
                }
                
                if (!hasArtist) {
                    return false;
                }
            }

            return true;
        });

        return songs.sort(
            (itemA: SortableObjectChoice<SpotifySongSortable>, itemB: SortableObjectChoice<SpotifySongSortable>) => {
                return itemA.item.getDisplayName().localeCompare(itemB.item.getDisplayName());
            }
        );
    }
}