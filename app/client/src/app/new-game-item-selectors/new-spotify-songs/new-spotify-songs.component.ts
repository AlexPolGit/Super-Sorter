import { Component } from '@angular/core';
import { NewGameTypeComponent } from '../new-game-type.component';
import { SpotfiyPlaylistSongLoader } from 'src/app/_data-loaders/spotify-playlist-song-loader';

@Component({
    selector: 'app-new-spotify-songs',
    templateUrl: './new-spotify-songs.component.html',
    styleUrl: './new-spotify-songs.component.scss'
})
export class NewSpotifySongsComponent extends NewGameTypeComponent {
    spotfiyPlaylistSongLoader = this.gameDataService.getDataLoader(SpotfiyPlaylistSongLoader.identifier) as SpotfiyPlaylistSongLoader;
}
