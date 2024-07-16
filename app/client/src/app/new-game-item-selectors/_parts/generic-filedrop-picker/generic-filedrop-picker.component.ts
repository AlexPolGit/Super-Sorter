import { Component } from '@angular/core';
import { NgxFileDropModule } from 'ngx-file-drop';
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
        NgxFileDropModule,
        FileDropperComponent
    ],
    templateUrl: './generic-filedrop-picker.component.html',
    styleUrl: './generic-filedrop-picker.component.scss'
})
export class GenericFiledropPickerComponent extends DataLoaderComponent<ValidLoaders> {

    characterTextbox: string = "";

    constructor(override gameDataService: GameDataService) {
        super(gameDataService);
    }

    async fileDataLoaded(event: any) {
        if (this.dataLoader) {
            let itemsToAdd = (event as string[]).map((item: string, index: number) => {
                let split = item.split(',');

                // TODO: localize
                if (split.length !== 2) {
                    throw new UserError("Please make sure your CSV file only has 2 columns.", "Invalid File Input");
                }

                let name = split[0].trim();

                if (name.length === 0) {
                    throw new UserError(`Empty name detected at line ${index + 1}.`, "Invalid File Input");
                }

                let image = split[1].trim();

                if (!this.isValidHttpUrl(image)) {
                    throw new UserError(`Invalid URL detected at line ${index + 1}.`, "Invalid File Input");
                }

                return {
                    name: name,
                    image: image
                }
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
