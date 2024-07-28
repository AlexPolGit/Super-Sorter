import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SortableObject } from 'src/app/_objects/sortables/sortable';
import { GameDataService } from 'src/app/_services/game-data-service';
import { DataLoaderComponent } from '../data-loader-component';
import { SteamGameIdLoader } from 'src/app/_data-loaders/steam-game-id-loader';
import { IS_URL_REGEX } from '../steam-library-picker/steam-library-picker.component';

type ValidLoaders = SteamGameIdLoader;

export const STEAM_STORE_APP_URL_REGEX = new RegExp("(app)\/[0-9]*(\/|$)");

export function extractAppId(urlOrId: string): string | null {
    console.log(urlOrId);
    const isUrl = urlOrId.match(IS_URL_REGEX);
    if (isUrl && isUrl.length > 0) {
        const appId = urlOrId.match(STEAM_STORE_APP_URL_REGEX);
        if (appId && appId.length > 0) {
            let id = appId[0];
            id = id.charAt(0) === "/" ? id.substring(1) : id;
            id = id.startsWith("app/") ? id.substring(4) : id;
            id = id.charAt(id.length - 1) === "/" ? id.substring(0, id.length - 1) : id;
            return id;
        }
        else {
            return null;
        }
    }
    else if (!isNaN(Number(urlOrId))) {
        return urlOrId;
    }
    else {
        return null;
    }
}

@Component({
    selector: 'app-steam-textbox-picker',
    standalone: true,
    imports: [
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './steam-textbox-picker.component.html',
    styleUrl: './steam-textbox-picker.component.scss'
})
export class SteamTextboxPickerComponent extends DataLoaderComponent<ValidLoaders> {
    
    @Input() textboxPlaceholder: string = "Enter items IDs seperated by newlines.";
    @Input() textboxLabel: string = "Item IDs";
    @Input() buttonName: string = "Load Items";

    itemTextbox: string = "";

    constructor(override gameDataService: GameDataService) {
        super(gameDataService);
    }

    async loadFromTextbox() {
        if (this.dataLoader) {
            const lines = this.itemTextbox.split(/\r?\n/);
            const items = (lines).map(item => extractAppId(item)).filter(id => id !== null) as string[];

            this.loadingDone = false;
            this.loadingData.emit($localize`:@@loading-text-steam-textbox-picker:Loading IDs from textbox.`);
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
