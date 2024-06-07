import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxFileDropModule } from 'ngx-file-drop';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { AnilistLoader } from 'src/app/_util/game-loaders/anilist-loader';
import { FileDropperComponent } from 'src/app/file-dropper/file-dropper.component';

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
export class AnilistFiledropPickerComponent {
 
    @Input() loader: string = "default";
    @Output() chooseData = new EventEmitter<SortableObject[]>();

    dataLoader: AnilistLoader | null = null;
    characterTextbox: string = "";

    constructor(private gameDataService: GameDataService) {}

    ngOnInit() {
        this.dataLoader = this.gameDataService.getDataLoader(this.loader) as AnilistLoader;
    }

    async fileDataLoaded(event: any) {
        if (this.dataLoader) {
            let chars = (event as string[]).map((id: string) => parseInt(id));
            this.dataLoader.getItemListFromIds(chars, [], 1).then((characters: SortableObject[]) => {
                this.chooseData.emit(characters);
            });
        }
    }
}
