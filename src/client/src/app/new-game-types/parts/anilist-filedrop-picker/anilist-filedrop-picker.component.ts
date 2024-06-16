import { Component } from '@angular/core';
import { NgxFileDropModule } from 'ngx-file-drop';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { AnilistLoader } from 'src/app/_util/game-loaders/anilist-loader';
import { FileDropperComponent } from 'src/app/file-dropper/file-dropper.component';
import { DataLoaderComponent } from '../data-loader-component';

@Component({
    selector: 'app-anilist-filedrop-picker',
    standalone: true,
    imports: [
        NgxFileDropModule,
        FileDropperComponent
    ],
    templateUrl: './anilist-filedrop-picker.component.html',
    styleUrl: './anilist-filedrop-picker.component.scss'
})
export class AnilistFiledropPickerComponent extends DataLoaderComponent<AnilistLoader> {

    characterTextbox: string = "";

    constructor(override gameDataService: GameDataService) {
        super(gameDataService);
    }

    fileDataLoaded(event: any) {
        if (this.dataLoader) {
            let chars = (event as string[]).map((id: string) => parseInt(id));

            this.loadingDone = false;
            this.loadingData.emit($localize`:@@loading-text-anilist-filedrop-picker:Loading IDs from file.`);
            this.dataLoader.getItemListFromIds(chars, [], 1).then(
                (items: SortableObject[]) => {
                    this.chooseData.emit(items);
                },
                (error) => {
                    this.chooseData.emit([]);
                    throw error;
                },
            );
        }
    }
}
