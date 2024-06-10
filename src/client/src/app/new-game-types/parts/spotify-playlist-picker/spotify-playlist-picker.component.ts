import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { SpotfiyPlaylistSongLoader } from 'src/app/_util/game-loaders/spotify-playlist-song-loader';

@Component({
    selector: 'app-spotify-playlist-picker',
    standalone: true,
    imports: [
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './spotify-playlist-picker.component.html',
    styleUrl: './spotify-playlist-picker.component.scss'
})
export class SpotifyPlaylistPickerComponent {
    @Input() loaderName: string = "default";
    @Output() chooseData = new EventEmitter<SortableObject[]>();

    dataLoader: SpotfiyPlaylistSongLoader | null = null;

    playlistId: string = "";

    constructor(private gameDataService: GameDataService) {}

    ngOnInit() {
        this.dataLoader = this.gameDataService.getDataLoader(this.loaderName) as SpotfiyPlaylistSongLoader;
    }

    loadFromPlaylistId() {
        if (this.dataLoader) {
            this.dataLoader.getSongsInPlaylist(this.playlistId).then((characters: SortableObject[]) => {
                this.chooseData.emit(characters);
            });
        }
    }
}
