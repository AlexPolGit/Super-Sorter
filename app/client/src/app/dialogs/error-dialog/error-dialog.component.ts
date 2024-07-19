import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomError, ServerError } from 'src/app/_objects/custom-error';

interface DialogInput {
    inputError: CustomError;
    showOK: boolean;
}

@Component({
    selector: 'app-error-dialog',
    standalone: true,
    imports: [ CommonModule, MatButtonModule, MatDialogModule, MatChipsModule ],
    templateUrl: './error-dialog.component.html',
    styleUrl: './error-dialog.component.scss'
})
export class ErrorDialogComponent {
    errorTitle: string = "";
    errorMessage: string = "";
    canReport: boolean = false;

    constructor(
        public dialogRef: MatDialogRef<ErrorDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public input: DialogInput,
        private snackBar: MatSnackBar
    ) {
        this.errorTitle = this.input.inputError.errorTitle;
        this.errorMessage = this.input.inputError.message;
        if (input.inputError instanceof ServerError) {
            this.canReport = true;
        }
    }

    sendErrorReport() {
        this.snackBar.open($localize`:@@error-dialog-report-sent:Report sent.`, undefined, {
            duration: 2000
        });
    }
}
