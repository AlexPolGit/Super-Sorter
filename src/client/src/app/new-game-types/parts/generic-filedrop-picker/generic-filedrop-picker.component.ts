import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxFileDropModule } from 'ngx-file-drop';
import { UserError } from 'src/app/_objects/custom-error';
import { GenericSortable } from 'src/app/_objects/sortables/generic-item';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { GenericItemLoader } from 'src/app/_util/game-loaders/generic-item-loader';
import { FileDropperComponent } from 'src/app/file-dropper/file-dropper.component';

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
export class GenericFiledropPickerComponent {

    @Input() loader: string = "default";
    @Output() chooseData = new EventEmitter<SortableObject[]>();

    dataLoader: GenericItemLoader | null = null;
    characterTextbox: string = "";

    constructor(private gameDataService: GameDataService) {}

    ngOnInit() {
        this.dataLoader = this.gameDataService.getDataLoader(this.loader) as GenericItemLoader;
    }

    async fileDataLoaded(event: any) {
        if (this.dataLoader) {
            let items = (event as string[]).map((item: string, index: number) => {
                let split = item.split(',');

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

                return new GenericSortable("[undefined]", image, name);
            });

            this.chooseData.emit(items);
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
