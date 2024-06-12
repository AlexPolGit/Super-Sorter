import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { SortableObject } from '../_objects/sortables/sortable';
import { VALID_GAME_TYPES } from '../_objects/game-option';
import { InterfaceError } from '../_objects/custom-error';
import { AnilistFavouriteCharacterLoader } from '../_util/game-loaders/anilist-favourite-character-loader';
import { AnilistFavouriteStaffLoader } from '../_util/game-loaders/anilist-favourite-staff-loader';
import { GenericItemLoader } from '../_util/game-loaders/generic-item-loader';
import { UserPreferenceService } from '../_services/user-preferences-service';
import { AnilistFavouriteAnimeLoader } from '../_util/game-loaders/anilist-favourite-anime-loader';
import { SpotfiyPlaylistSongLoader } from '../_util/game-loaders/spotify-playlist-song-loader';
import { GameDataService } from '../_services/game-data-service';
import { AnilistFavouriteMangaLoader } from '../_util/game-loaders/anilist-favourite-manga-loader';

export interface NewGameDialogInput {
    gameType: string;
}

export interface NewGameDialogOutput {
    name: string;
    startingData: SortableObject[];
    algorithm: string;
    scrambleInput: boolean;
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
    anilistFavouriteCharacterLoader = this.gameDataService.getDataLoader(AnilistFavouriteCharacterLoader.identifier) as AnilistFavouriteCharacterLoader;
    anilistFavouriteStaffLoader = this.gameDataService.getDataLoader(AnilistFavouriteStaffLoader.identifier) as AnilistFavouriteStaffLoader;
    anilistFavouriteAnimeLoader = this.gameDataService.getDataLoader(AnilistFavouriteAnimeLoader.identifier) as AnilistFavouriteAnimeLoader;
    anilistFavouritemMangaLoader = this.gameDataService.getDataLoader(AnilistFavouriteMangaLoader.identifier) as AnilistFavouriteMangaLoader;
    spotfiyPlaylistSongLoader = this.gameDataService.getDataLoader(SpotfiyPlaylistSongLoader.identifier) as SpotfiyPlaylistSongLoader;

    nameFormControl = new FormControl('', [ Validators.required ]);
    currentlyLoading: boolean = false;

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
    }

    pageTitle(): string {
        if (this.inputData.gameType == 'generic-items') {
            return $localize`:@@new-generic-item-comparison-title:New Generic Item Comparison`;
        }
        if (this.inputData.gameType == 'anilist-character') {
            return $localize`:@@new-anilist-char-comparison-title:New Anilist Character Comparison`;
        }
        else if (this.inputData.gameType == 'anilist-staff') {
            return $localize`:@@new-anilist-staff-comparison-title:New Anilist Staff Comparison`;
        }
        else if (this.inputData.gameType == 'anilist-anime') {
            return $localize`:@@new-anilist-anime-comparison-title:New Anilist Anime Comparison`;
        }
        else if (this.inputData.gameType == 'anilist-manga') {
            return $localize`:@@new-anilist-manga-comparison-title:New Anilist Manga Comparison`;
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
            })

            let outputData: NewGameDialogOutput = {
                name: this.nameFormControl.value,
                startingData: startingData,
                algorithm: this.algorithm,
                scrambleInput: this.scrambleInput
            };
            this.dialogRef.close(outputData);
        }
    }

    getItemDisplayName(item: SortableObject) {
        return item.getDisplayName(this.userPreferenceService.getAnilistLanguage());
    }
}
