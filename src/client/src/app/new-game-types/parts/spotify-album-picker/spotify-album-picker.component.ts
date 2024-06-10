import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { SpotfiyAlbumSongLoader } from 'src/app/_util/game-loaders/spotify-album-song-loader';

@Component({
    selector: 'app-spotify-album-picker',
    standalone: true,
    imports: [
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './spotify-album-picker.component.html',
    styleUrl: './spotify-album-picker.component.scss'
})
export class SpotifyAlbumPickerComponent {
    @Input() loaderName: string = "default";
    @Output() chooseData = new EventEmitter<SortableObject[]>();

    dataLoader: SpotfiyAlbumSongLoader | null = null;

    albumId: string = "";

    constructor(private gameDataService: GameDataService) {}

    ngOnInit() {
        this.dataLoader = this.gameDataService.getDataLoader(this.loaderName) as SpotfiyAlbumSongLoader;
    }

    loadFromAlbumId() {
        if (this.dataLoader) {
            this.dataLoader.getSongsInAlbum(this.albumId).then((characters: SortableObject[]) => {
                this.chooseData.emit(characters);
            });
        }
    }
}
