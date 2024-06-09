import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogInput {
    confirmationTitle: string;
    confirmationText: string;
}

export interface ConfirmDialogOutput {
    choice: "confirm" | "cancel";
}

@Component({
    selector: 'app-confirmation-dialog',
    standalone: true,
    imports: [ CommonModule, MatButtonModule, MatDialogModule ],
    templateUrl: './confirmation-dialog.component.html',
    styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
    confirmationTitle: string = "";
    confirmationText: string = "";

    constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public input: ConfirmDialogInput) {
        this.confirmationTitle = this.input.confirmationTitle;
        this.confirmationText = this.input.confirmationText;
    }

    sendConfirm() {
        let result: ConfirmDialogOutput = {
            choice: "confirm"
        };
        this.dialogRef.close(result);
    }

    sendCancel() {
        let result: ConfirmDialogOutput = {
            choice: "cancel"
        };
        this.dialogRef.close(result);
    }
}
