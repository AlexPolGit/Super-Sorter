import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { SortableObject } from '../_objects/sortables/sortable';
import { SortableObjectLoader } from '../_util/loaders/sortable-object-loader';

export interface NewGameDialogInput {
    gameType: string;
    characterReader: SortableObjectLoader;
}

export interface NewGameDialogOutput {
    name: string;
    data: SortableObject[];
}

@Component({
    selector: 'new-game.component',
    templateUrl: 'new-game.component.html',
    styleUrls: ['./new-game.component.scss']
})
export class NewGameComponent {

    nameFormControl = new FormControl('', [ Validators.required ]);
    usernameFormControl = new FormControl('', [ Validators.required ]);
    // itemList: SortableObject[] = [];

    constructor(private dialogRef: MatDialogRef<NewGameComponent>, @Inject(MAT_DIALOG_DATA) public inputData: NewGameDialogInput) {}

    // fileDataLoaded(data: string[]) {
    //     console.log(`Read file data:`, data);
    //     this.itemList = data;
    // }

    canStartSession() {
        let canStartSession = !this.usernameFormControl.hasError('required');
        return canStartSession;
    }

    startSession() {
        const sessionName = this.nameFormControl.value ? this.nameFormControl.value : "Session Name";
        const username = this.usernameFormControl.value ? this.usernameFormControl.value : "";

        this.inputData.characterReader.getObjects(username).then((items: SortableObject[]) => {
            let outputData: NewGameDialogOutput = {
                name: sessionName,
                data: items
            }
            this.dialogRef.close(outputData);
        });
    }
}
