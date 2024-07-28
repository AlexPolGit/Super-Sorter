import { Component } from '@angular/core';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { FileDropperComponent } from 'src/app/file-dropper/file-dropper.component';
import { DataLoaderComponent } from '../data-loader-component';
import { SteamGameIdLoader } from 'src/app/_data-loaders/steam-game-id-loader';
import { extractAppId } from '../steam-textbox-picker/steam-textbox-picker.component';

type ValidLoaders = SteamGameIdLoader;

@Component({
    selector: 'app-steam-filedrop-picker',
    standalone: true,
    imports: [
        FileDropperComponent
    ],
    templateUrl: './steam-filedrop-picker.component.html',
    styleUrl: './steam-filedrop-picker.component.scss'
})
export class SteamFiledropPickerComponent extends DataLoaderComponent<ValidLoaders> {
    
    characterTextbox: string = "";

    constructor(override gameDataService: GameDataService) {
        super(gameDataService);
    }

    fileDataLoaded(event: any) {
        if (this.dataLoader) {
            const items = (event as string[]).map(item => extractAppId(item)).filter(id => id !== null) as string[];

            this.loadingDone = false;
            this.loadingData.emit($localize`:@@loading-text-steam-filedrop-picker:Loading IDs from file.`);
            this.dataLoader.getSortables(items).then(
                (items: SortableObject[]) => {
                    this.emitItems(items);
                },
                (error) => {
                    this.emitItems([]);
                    throw error;
                }
            );
        }
    }
}
