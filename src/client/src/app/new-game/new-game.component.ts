import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { SortableObject } from '../_objects/sortables/sortable';
import { VALID_GAME_TYPES } from '../_objects/game-option';
import { InterfaceError } from '../_objects/custom-error';

export interface NewGameDialogInput {
    gameType: string;
}

export interface NewGameDialogOutput {
    name: string;
    startingData: SortableObject[];
}

@Component({
    selector: 'new-game.component',
    templateUrl: 'new-game.component.html',
    styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent {

    nameFormControl = new FormControl('', [ Validators.required ]);

    startingItems: SortableObject[] = []

    selected: boolean[] = [];

    constructor(
        private dialogRef: MatDialogRef<NewGameComponent>,
        @Inject(MAT_DIALOG_DATA) public inputData: NewGameDialogInput
    ) {
        if (!VALID_GAME_TYPES.includes(this.inputData.gameType)) {
            throw new InterfaceError(`Invalid game type: ${this.inputData.gameType}`);
        }
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
            let outputData: NewGameDialogOutput = {
                name: this.nameFormControl.value,
                startingData: this.startingItems
            };
            this.dialogRef.close(outputData);
        }
    }
}
