import { Component } from '@angular/core';
import { UserError } from 'src/app/_objects/custom-error';
import { GenericSortable } from 'src/app/_objects/sortables/generic-item';
import { GameDataService } from 'src/app/_services/game-data-service';
import { GenericItemLoader } from 'src/app/_data-loaders/generic-item-loader';
import { FileDropperComponent } from 'src/app/file-dropper/file-dropper.component';
import { DataLoaderComponent } from '../data-loader-component';

type ValidLoaders = GenericItemLoader;

@Component({
    selector: 'app-generic-filedrop-picker',
    standalone: true,
    imports: [
        FileDropperComponent
    ],
    templateUrl: './generic-filedrop-picker.component.html',
    styleUrl: './generic-filedrop-picker.component.scss'
})
export class GenericFiledropPickerComponent extends DataLoaderComponent<ValidLoaders> {

    readonly INVALID_FILE_INPUT = $localize`:@@generic-file-data-error-title:Invalid File Input`
    characterTextbox: string = "";

    constructor(override gameDataService: GameDataService) {
        super(gameDataService);
    }

    async fileDataLoaded(event: any) {
        if (this.dataLoader) {
            let itemsToAdd = (event as string[]).map((item: string, index: number) => {
                let split = item.split(',');

                if (split.length !== 2) {
                    throw new UserError($localize`:@@generic-file-data-error-two-columns:Please make sure your CSV file only has 2 columns.`, this.INVALID_FILE_INPUT);
                }

                const name = split[0].trim();

                if (name.length === 0) {
                    throw new UserError($localize`:@@generic-file-data-error-empy-name:Empty name detected at line ${index + 1}:line:.`, this.INVALID_FILE_INPUT);
                }

                const image = split[1].trim();

                if (!this.isValidHttpUrl(image)) {
                    throw new UserError($localize`:@@generic-file-data-error-invalid-url:Invalid URL detected at line ${index + 1}:line:.`, this.INVALID_FILE_INPUT);
                }

                return {
                    name: name,
                    image: image
                };
            });

            this.loadingDone = false;
            this.loadingData.emit($localize`:@@loading-text-generic-filedrop-picker:Loading IDs from file.`);
            this.dataLoader.getSortables(itemsToAdd).then((items: GenericSortable[]) => {
                this.emitItems(items);
            });
        }
    }

    // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
    isValidHttpUrl(urlString: string) {
        let url;
        
        try {
            url = new URL(urlString);
        }
        catch {
            return false;  
        }

        return url.protocol === "http:" || url.protocol === "https:";
    }
}
