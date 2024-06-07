import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { SortableObject } from '../_objects/sortables/sortable';
import { VALID_GAME_TYPES } from '../_objects/game-option';
import { InterfaceError } from '../_objects/custom-error';
import { AnilistFavouriteCharacterLoader } from '../_util/game-loaders/anilist-favourite-character-loader';
import { AnilistFavouriteStaffLoader } from '../_util/game-loaders/anilist-favourite-staff-loader';
import { ActivatedRoute } from '@angular/router';

export interface NewGameDialogInput {
    gameType: string;
}

export interface NewGameDialogOutput {
    name: string;
    startingData: SortableObject[];
    algorithm: string;
    scrambleInput: boolean;
}

@Component({
    selector: 'new-game.component',
    templateUrl: 'new-game.component.html',
    styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent {

    anilistFavouriteCharacterLoader: string = AnilistFavouriteCharacterLoader.identifier;
    anilistFavouriteStaffLoader: string = AnilistFavouriteStaffLoader.identifier;

    nameFormControl = new FormControl('', [ Validators.required ]);

    startingItems: SortableObject[] = [];
    selected: boolean[] = [];
    algorithm: string = "queue-merge";
    scrambleInput: boolean = true;
    language: string = "en";

    constructor(
        private dialogRef: MatDialogRef<NewGameComponent>,
        @Inject(MAT_DIALOG_DATA) public inputData: NewGameDialogInput,
        private route: ActivatedRoute
    ) {
        if (!VALID_GAME_TYPES.includes(this.inputData.gameType)) {
            throw new InterfaceError(`Invalid game type: ${this.inputData.gameType}`);
        }

        this.route.queryParams.subscribe((params: any) => {
            this.language = params.language ? params.language : "en";
        });
    }

    pageTitle(): string {
        if (this.inputData.gameType == 'anilist-character') {
            return "New Anilist Character Comparison";
        }
        else if (this.inputData.gameType == 'anilist-staff') {
            return "New Anilist Staff Comparison"
        }
        else {
            return "New Comparison"
        }
    }

    loadNewGameData(event: any) {
        this.selected = new Array(event.length).fill(true);
        this.startingItems = event;
    }

    canStartSession() {
        return this.startingItems.length > 0 && !this.nameFormControl.hasError('required');
    }

    startSession() {
        if (!this.nameFormControl.value) {
            throw new InterfaceError(`Missing game name!`);
        }
        else if (this.startingItems.length === 0) {
            throw new InterfaceError(`Empty starting data!`);
        }
        else {
            let startingData = this.startingItems.filter((item: SortableObject, index: number) => {
                return this.selected[index];
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
}
