import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AnilistWebService } from '../_services/anilist-web-service';
import { SortableObject } from '../_objects/sortables/sortable';
import { AnilistCharacterSortable } from '../_objects/sortables/anilist-character';
import { VALID_GAME_TYPES } from '../_objects/game-option';

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
        private anilistWebService: AnilistWebService
    ) {
        if (!VALID_GAME_TYPES.includes(this.inputData.gameType)) {
            throw new Error(`Invalid game type: ${this.inputData.gameType}`);
        }
    }

    canStartSession() {
        let canStartSession = false;

        if (this.inputData.gameType == 'anilist-character') {
            canStartSession = !this.usernameFormControl.hasError('required');
        }

        return canStartSession;
    }

    startSession() {
        if (this.inputData.gameType == 'anilist-character') {
            if (!this.usernameFormControl.value) {
                throw new Error(`Missing Anilist username!`);
            }

            this.anilistWebService.setupAnilistCharacterGame(this.usernameFormControl.value).then((chars: AnilistCharacterSortable[]) => {
                this.endDialog(chars);
            });
        }
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
