import { Component } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { FileDropperComponent } from 'src/app/file-dropper/file-dropper.component';
import { DataLoaderComponent } from '../data-loader-component';
import { AnilistCharacterIdLoader } from 'src/app/_data-loaders/anilist-character-id-loader';
import { AnilistStaffIdLoader } from 'src/app/_data-loaders/anilist-staff-id-loader';
import { AnilistMediaIdLoader } from 'src/app/_data-loaders/anilist-media-id-loader';

type ValidLoaders = AnilistCharacterIdLoader | AnilistStaffIdLoader | AnilistMediaIdLoader;

@Component({
    selector: 'app-anilist-filedrop-picker',
    standalone: true,
    imports: [
        FileDropperComponent
    ],
    templateUrl: './anilist-filedrop-picker.component.html',
    styleUrl: './anilist-filedrop-picker.component.scss'
})
export class AnilistFiledropPickerComponent extends DataLoaderComponent<ValidLoaders> {
    
    characterTextbox: string = "";

    constructor(override gameDataService: GameDataService) {
        super(gameDataService);
    }

    fileDataLoaded(event: any) {
        if (this.dataLoader) {
            let chars = (event as string[]).map((id: string) => parseInt(id));

            this.loadingDone = false;
            this.loadingData.emit($localize`:@@loading-text-anilist-filedrop-picker:Loading IDs from file.`);
            this.dataLoader.getSortables(chars).then(
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
