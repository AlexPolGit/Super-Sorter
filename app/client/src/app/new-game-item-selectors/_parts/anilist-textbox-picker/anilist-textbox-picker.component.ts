import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { DataLoaderComponent } from '../data-loader-component';
import { AnilistCharacterIdLoader } from 'src/app/_util/data-loaders/anilist-character-id-loader';
import { AnilistStaffIdLoader } from 'src/app/_util/data-loaders/anilist-staff-id-loader';
import { AnilistMediaIdLoader } from 'src/app/_util/data-loaders/anilist-media-id-loader';

type ValidLoaders = AnilistCharacterIdLoader | AnilistStaffIdLoader | AnilistMediaIdLoader;

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
export class AnilistTextboxPickerComponent extends DataLoaderComponent<ValidLoaders> {
    
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
            this.dataLoader.getSortables(lines).then(
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
