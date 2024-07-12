import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { AnilistLoader } from 'src/app/_util/game-loaders/anilist-loader';
import { DataLoaderComponent } from '../data-loader-component';

@Component({
    selector: 'app-anilist-textbox-picker',
    standalone: true,
    imports: [
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './anilist-textbox-picker.component.html',
    styleUrl: './anilist-textbox-picker.component.scss'
})
export class AnilistTextboxPickerComponent extends DataLoaderComponent<AnilistLoader> {

    override dataLoader: AnilistLoader | null = null;
    @Input() textboxPlaceholder: string = "Enter items IDs seperated by newlines.";
    @Input() textboxLabel: string = "Item IDs";
    @Input() buttonName: string = "Load Items";

    characterTextbox: string = "";

    constructor(override gameDataService: GameDataService) {
        super(gameDataService);
    }

    async loadFromTextbox() {
        if (this.dataLoader) {
            let lines = this.characterTextbox.split(/\r?\n/).map((id: string) => parseInt(id));

            this.loadingDone = false;
            this.loadingData.emit($localize`:@@loading-text-anilist-textbox-picker:Loading IDs from textbox.`);
            this.dataLoader.getItemListFromIds(lines, [], 1).then(
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
