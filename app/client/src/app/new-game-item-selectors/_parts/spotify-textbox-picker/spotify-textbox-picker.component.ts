import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { DataLoaderComponent } from '../data-loader-component';
import { SpotifySongIdLoader } from 'src/app/_data-loaders/spotify-song-id-loader';
import { extractIdFromUrl } from '../spotify-playlist-or-album-picker/spotify-playlist-or-album-picker.component';

type ValidLoaders = SpotifySongIdLoader;

@Component({
    selector: 'app-spotify-textbox-picker',
    standalone: true,
    imports: [
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './spotify-textbox-picker.component.html',
    styleUrl: './spotify-textbox-picker.component.scss'
})
export class SpotifyTextboxPickerComponent extends DataLoaderComponent<ValidLoaders> {
    
    @Input() textboxPlaceholder: string = "Enter items IDs seperated by newlines.";
    @Input() textboxLabel: string = "Item IDs";
    @Input() buttonName: string = "Load Items";

    itemTextbox: string = "";

    constructor(override gameDataService: GameDataService) {
        super(gameDataService);
    }

    async loadFromTextbox() {
        if (this.dataLoader) {
            const lines = this.itemTextbox.split(/\r?\n/).map(item => extractIdFromUrl(item));

            this.loadingDone = false;
            this.loadingData.emit($localize`:@@loading-text-spotify-textbox-picker:Loading IDs from textbox.`);
            this.dataLoader.getSortables(lines).then(
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
