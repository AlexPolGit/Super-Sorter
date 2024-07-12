import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CustomError } from 'src/app/_objects/custom-error';

interface DialogInput {
    inputError: CustomError;
    showOK: boolean;
}

@Component({
    selector: 'app-error-dialog',
    standalone: true,
    imports: [ CommonModule, MatButtonModule, MatDialogModule ],
    templateUrl: './error-dialog.component.html',
    styleUrl: './error-dialog.component.scss'
})
export class ErrorDialogComponent {
    errorTitle: string = "";
    errorMessage: string = "";

    constructor(public dialogRef: MatDialogRef<ErrorDialogComponent>, @Inject(MAT_DIALOG_DATA) public input: DialogInput) {
        this.errorTitle = this.input.inputError.errorTitle;
        this.errorMessage = this.input.inputError.message;
    }
}
