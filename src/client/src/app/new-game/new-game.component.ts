import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { SortableObject } from '../_objects/sortables/sortable';
import { VALID_GAME_TYPES } from '../_objects/game-option';
import { InterfaceError } from '../_objects/custom-error';
import { AnilistCharacterLoader } from '../_util/game-loaders/anilist-character-loader';
import { AnilistStaffLoader } from '../_util/game-loaders/anilist-staff-loader';
import { GenericItemLoader } from '../_util/game-loaders/generic-item-loader';
import { UserPreferenceService } from '../_services/user-preferences-service';
import { SpotfiyPlaylistSongLoader } from '../_util/game-loaders/spotify-playlist-song-loader';
import { GameDataService } from '../_services/game-data-service';
import { AnilistMediaLoader } from '../_util/game-loaders/anilist-media-loader';
import { FullExportObject } from '../_objects/export-gamestate';

export interface NewGameDialogInput {
    gameType: string;
    importData?: FullExportObject;
}

export interface NewGameDialogOutput {
    name: string;
    startingData: SortableObject[];
    algorithm: string;
    scrambleInput: boolean;
    importedState?: FullExportObject
}

interface SortableObjectChoice {
    item: SortableObject;
    selected: boolean;
}

@Component({
    selector: 'new-game.component',
    templateUrl: 'new-game.component.html',
    styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent {

    genericItemLoader = this.gameDataService.getDataLoader(GenericItemLoader.identifier) as GenericItemLoader;
    anilistCharacterLoader = this.gameDataService.getDataLoader(AnilistCharacterLoader.identifier) as AnilistCharacterLoader;
    anilistStaffLoader = this.gameDataService.getDataLoader(AnilistStaffLoader.identifier) as AnilistStaffLoader;
    anilistMediaLoader = this.gameDataService.getDataLoader(AnilistMediaLoader.identifier) as AnilistMediaLoader;
    spotfiyPlaylistSongLoader = this.gameDataService.getDataLoader(SpotfiyPlaylistSongLoader.identifier) as SpotfiyPlaylistSongLoader;

    nameFormControl = new FormControl('', [ Validators.required ]);
    currentlyLoading: boolean = false;

    importData?: FullExportObject;

    startingItems: Map<string, SortableObjectChoice> = new Map<string, SortableObjectChoice>();
    algorithm: string = "queue-merge";
    scrambleInput: boolean = true;

    constructor(
        private dialogRef: MatDialogRef<NewGameComponent>,
        @Inject(MAT_DIALOG_DATA) public inputData: NewGameDialogInput,
        private userPreferenceService: UserPreferenceService,
        private gameDataService: GameDataService
    ) {
        if (!VALID_GAME_TYPES.includes(this.inputData.gameType)) {
            throw new InterfaceError(`Invalid game type: ${this.inputData.gameType}`);
        }
  
        if (this.inputData.importData) {
            this.importData = this.inputData.importData;
            this.algorithm = this.importData.algorithm;

            let existingItems = this.inputData.importData.items;
            this.gameDataService.getDataLoader(this.inputData.gameType).getSortablesFromListOfStrings(existingItems).then((sortables: SortableObject[]) => {
                console.log(sortables);
                this.loadNewGameData(sortables);
            });
        }
    }

    pageTitle(): string {
        if (this.inputData.gameType == 'generic-items') {
            return $localize`:@@new-generic-item-comparison-title:New Generic Item Comparison`;
        }
        else if (this.inputData.gameType == 'anilist-character') {
            return $localize`:@@new-anilist-char-comparison-title:New Anilist Character Comparison`;
        }
        else if (this.inputData.gameType == 'anilist-staff') {
            return $localize`:@@new-anilist-staff-comparison-title:New Anilist Staff Comparison`;
        }
        else if (this.inputData.gameType == 'anilist-media') {
            return $localize`:@@new-anilist-media-comparison-title:New Anilist Anime and Manga Comparison`;
        }
        else if (this.inputData.gameType == 'spotify-song') {
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
        event.forEach((newItem: SortableObject) => {
            this.startingItems.set(newItem.id, {
                item: newItem,
                selected: this.startingItems.has(newItem.id) ? (this.startingItems.get(newItem.id) as SortableObjectChoice).selected : true
            });
        });
    }

    canStartSession() {
        return this.startingItems.size > 0 && !this.nameFormControl.hasError('required');
    }

    startSession() {
        if (!this.nameFormControl.value) {
            throw new InterfaceError(`Missing game name!`);
        }
        else if (this.startingItems.size === 0) {
            throw new InterfaceError(`Empty starting data!`);
        }
        else {
            let startingData: SortableObject[] = [];
            
            this.startingItems.forEach((choice: SortableObjectChoice) => {
                if (choice.selected) {
                    startingData.push(choice.item);
                }
                else {
                    if (this.importData) {
                        if (
                            Object.hasOwn(this.importData, 'history') &&
                            Object.hasOwn(this.importData, 'deleted') &&
                            Object.hasOwn(this.importData, 'deletedHistory')) {
                            
                            this.importData.deleted = this.importData.deleted.filter((deletedItem: string) => {
                                return (deletedItem !== choice.item.id);
                            });

                            this.importData.history = this.importData.history.filter((historyItem: string) => {
                                let split = historyItem.split(",");
                                if (split[0] !== choice.item.id &&
                                    split[1] !== choice.item.id &&
                                    split[2] !== choice.item.id
                                ) {
                                    return true;
                                }
                                return false;
                            });

                            this.importData.deletedHistory = this.importData.deletedHistory.filter((deletedHistoryItem: string) => {
                                let split = deletedHistoryItem.split(",");
                                if (split[0] !== choice.item.id &&
                                    split[1] !== choice.item.id &&
                                    split[2] !== choice.item.id
                                ) {
                                    return true;
                                }
                                return false;
                            });
                        }
                    }
                }
            });

            let outputData: NewGameDialogOutput = {
                name: this.nameFormControl.value,
                startingData: startingData,
                algorithm: this.algorithm,
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
