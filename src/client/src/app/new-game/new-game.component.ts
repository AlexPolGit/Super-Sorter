import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { SortableObject } from '../_objects/sortables/sortable';
import { VALID_GAME_TYPES } from '../_objects/game-option';
import { GameDataService } from '../_services/game-data-service';

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
    usernameFormControl = new FormControl('', [ Validators.required ]);

    constructor(
        private dialogRef: MatDialogRef<NewGameComponent>,
        @Inject(MAT_DIALOG_DATA) public inputData: NewGameDialogInput,
        private gameDataService: GameDataService
    ) {
        if (!VALID_GAME_TYPES.includes(this.inputData.gameType)) {
            throw new Error(`Invalid game type: ${this.inputData.gameType}`);
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

    canStartSession() {
        let canStartSession = false;

        if (this.inputData.gameType.startsWith('anilist-')) {
            canStartSession = !this.usernameFormControl.hasError('required');
        }

        return canStartSession;
    }

    startSession() {
        if (!this.usernameFormControl.value) {
            throw new Error(`Missing username input!`);
        }
        
        this.gameDataService.getDataLoader(this.inputData.gameType).setupGame(this.usernameFormControl.value).then((chars: SortableObject[]) => {
            this.endDialog(chars);
        });
    }

    endDialog(startingData: SortableObject[]) {
        if (!this.nameFormControl.value) {
            throw new Error(`Missing game name!`);
        }
        else {
            let outputData: NewGameDialogOutput = {
                name: this.nameFormControl.value,
                startingData: startingData
            }
            this.dialogRef.close(outputData);
        }
    }
}
