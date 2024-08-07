import { Component } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { FileDropperComponent } from 'src/app/file-dropper/file-dropper.component';
import { DataLoaderComponent } from '../data-loader-component';
import { SpotifySongIdLoader } from 'src/app/_data-loaders/spotify-song-id-loader';
import { extractIdFromUrl, validateInput } from '../spotify-playlist-or-album-picker/spotify-playlist-or-album-picker.component';

type ValidLoaders = SpotifySongIdLoader;

@Component({
    selector: 'app-spotify-filedrop-picker',
    standalone: true,
    imports: [
        FileDropperComponent
    ],
    templateUrl: './spotify-filedrop-picker.component.html',
    styleUrl: './spotify-filedrop-picker.component.scss'
})
export class SpotifyFiledropPickerComponent extends DataLoaderComponent<ValidLoaders> {
    
    characterTextbox: string = "";

    constructor(override gameDataService: GameDataService) {
        super(gameDataService);
    }

    fileDataLoaded(event: any) {
        if (this.dataLoader) {
            const items = (event as string[]).map(item => {
                if (validateInput(item)) {
                    return extractIdFromUrl(item);
                }
                else {
                    return null;
                }
            }).filter(id => id !== null) as string[];

            this.loadingDone = false;
            this.loadingData.emit($localize`:@@loading-text-spotify-filedrop-picker:Loading IDs from file.`);
            this.dataLoader.getSortables(items).then(
                (items: SortableObject[]) => {
                    this.emitItems(items);
                },
                (error) => {
                    this.emitItems([]);
                    throw error;
                },
            );
        }
    }
}
