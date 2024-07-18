import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { SortableObject } from '../_objects/sortables/sortable';
import { GameDataService } from '../_services/game-data-service';
import { SessionExportObject } from '../_objects/export-gamestate';
import { UserPreferenceService } from '../_services/user-preferences-service';
import { SortableItemTypes } from '@sorter/api/src/objects/sortable';
import { AlgorithmTypes } from '@sorter/api/src/objects/session';

export interface NewGameDialogInput {
    gameType: string;
    importData?: SessionExportObject;
}

export interface NewGameDialogOutput {
    name: string;
    startingData: SortableObject[];
    algorithm: AlgorithmTypes;
    scrambleInput: boolean;
    importedState?: SessionExportObject
}

@Component({
    selector: 'new-game.component',
    templateUrl: 'new-game.component.html',
    styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent {

    nameFormControl = new FormControl('', [ Validators.required ]);
    currentlyLoading: boolean = false;

    importData?: SessionExportObject;

    newGameData: SortableObject[] = [];
    startingItems: SortableObject[] = [];
    algorithm: string = "queue-merge";
    scrambleInput: boolean = true;

    constructor(
        private dialogRef: MatDialogRef<NewGameComponent>,
        @Inject(MAT_DIALOG_DATA) public inputData: NewGameDialogInput,
        private gameDataService: GameDataService,
        private userPreferenceService: UserPreferenceService
    ) {
        if (this.inputData.importData) {
            this.importData = this.inputData.importData;

            let existingItems = this.inputData.importData.items;
            this.gameDataService.getSessionItems(this.inputData.gameType as SortableItemTypes, existingItems).then(sortables => {
                this.loadNewGameData(sortables);
            });
        }
    }

    pageTitle(): string {
        if (this.inputData.gameType == "generic-items") {
            return $localize`:@@new-generic-item-comparison-title:New Generic Item Comparison`;
        }
        else if (this.inputData.gameType == "anilist-character") {
            return $localize`:@@new-anilist-char-comparison-title:New Anilist Character Comparison`;
        }
        else if (this.inputData.gameType == "anilist-staff") {
            return $localize`:@@new-anilist-staff-comparison-title:New Anilist Staff Comparison`;
        }
        else if (this.inputData.gameType == "anilist-media") {
            return $localize`:@@new-anilist-media-comparison-title:New Anilist Anime and Manga Comparison`;
        }
        else if (this.inputData.gameType == "spotify-artist") {
            return $localize`:@@new-spotify-song-comparison-title:New Spotify Song Comparison`;
        }
        else {
            return $localize`:@@new-comparison-title:New Comparison`;
        }
    }

    startLoadingData(event: any) {
        console.log(`Started loading data: "${event}"`);
        this.currentlyLoading = true;
    }
    
    loadNewGameData(event: SortableObject[]) {
        this.currentlyLoading = false;
        this.newGameData = event;
    }

    loadSelectedData(event: SortableObject[]) {
        this.startingItems = event;
    }

    startSession() {
        if (this.startingItems.length > 0 && this.nameFormControl.value) {
            let outputData: NewGameDialogOutput = {
                name: this.nameFormControl.value,
                startingData: this.startingItems,
                algorithm: this.algorithm as AlgorithmTypes,
                scrambleInput: this.scrambleInput,
                importedState: this.importData ? this.importData : undefined
            };
            this.dialogRef.close(outputData);
        }
    }

    getItemDisplayName(item: SortableObject) {
        return item.getDisplayName(this.userPreferenceService.getAnilistLanguage());
    }
}
