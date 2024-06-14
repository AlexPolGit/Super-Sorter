import { ErrorHandler, Injectable } from '@angular/core';
import { CustomError, ErrorType } from '../_objects/custom-error';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { AccountsService } from './accounts-service';

@Injectable({ providedIn: 'root' })
export class CustomErrorHandler implements ErrorHandler {

    constructor(
        public dialog: MatDialog,
        private accountsService: AccountsService
    ) {}

    handleError(error: Error) {
        console.error(error);

        if (error instanceof CustomError) {
            if (error.errorData && error.errorData.toLogin) {
                this.accountsService.logout();
            }

            this.openDialog(error);
        }
    }

    openDialog(
        error: CustomError,
        enterAnimationDuration: string = "0ms",
        exitAnimationDuration: string = "0ms"
    ): void {
        this.dialog.open(ErrorDialogComponent, {
            width: '500px',
            enterAnimationDuration,
            exitAnimationDuration,
            data: {
                inputError: error,
                showOK: error.errorType === ErrorType.USER
            }
        });
    }
}
