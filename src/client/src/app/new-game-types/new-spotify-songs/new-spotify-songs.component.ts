import { Component, EventEmitter, Output } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { SpotfiyAlbumSongLoader } from 'src/app/_util/game-loaders/spotify-album-song-loader';
import { SpotifyLoader } from 'src/app/_util/game-loaders/spotify-base';

@Component({
    selector: 'app-new-spotify-songs',
    templateUrl: './new-spotify-songs.component.html',
    styleUrl: './new-spotify-songs.component.scss'
})
export class NewSpotifySongsComponent {
    spotfiyAlbumSongLoader: string = SpotfiyAlbumSongLoader.identifier;

    dataLoader: SpotifyLoader;
    currentTab: number = 0;
    
    @Output() chooseData = new EventEmitter<SortableObject[]>();

    constructor(private gameDataService: GameDataService) {
        this.dataLoader = this.gameDataService.getDataLoader(this.spotfiyAlbumSongLoader) as SpotifyLoader;
    }

    setupCurrentSongList(songs: SortableObject[]) {
        this.dataLoader.addSortablesFromListOfStrings(songs as SortableObject[]).then(() => {
            this.chooseData.emit(songs);
        });
    }
}
