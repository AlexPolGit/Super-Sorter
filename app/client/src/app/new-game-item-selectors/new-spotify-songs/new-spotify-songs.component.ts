import { Component } from '@angular/core';
import { NewGameTypeComponent } from '../new-game-type.component';
import { SpotfiyPlaylistSongLoader } from 'src/app/_data-loaders/spotify-playlist-song-loader';
import { SpotfiyAlbumSongLoader } from 'src/app/_data-loaders/spotify-album-song-loader';
import { SpotifySongIdLoader } from 'src/app/_data-loaders/spotify-song-id-loader';

@Component({
    selector: 'app-new-spotify-songs',
    templateUrl: './new-spotify-songs.component.html',
    styleUrl: './new-spotify-songs.component.scss'
})
export class NewSpotifySongsComponent extends NewGameTypeComponent {
    spotfiyPlaylistSongLoader = this.gameDataService.getDataLoader(SpotfiyPlaylistSongLoader.identifier) as SpotfiyPlaylistSongLoader;
    spotfiyAlbumSongLoader = this.gameDataService.getDataLoader(SpotfiyAlbumSongLoader.identifier) as SpotfiyAlbumSongLoader;
    spotfiySongIdLoader = this.gameDataService.getDataLoader(SpotifySongIdLoader.identifier) as SpotifySongIdLoader;

    textboxPlaceholder = $localize`:@@new-game-spotify-song-textbox-placeholder:Enter song IDs seperated by newlines.`;
    textboxLabel = $localize`:@@new-game-spotify-song-textbox-label:Song IDs`;
    textboxButtonName = $localize`:@@new-game-spotify-song-textbox-button-name:Load Songs`;
    playlistSongLabel = $localize`:@@new-game-spotify-song-picker-playlist-id:Playlist Link or ID`;
    albumSongLabel = $localize`:@@new-game-spotify-song-picker-album-id:Album Link or ID`;
}
