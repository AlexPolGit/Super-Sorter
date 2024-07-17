import { ErrorHandler, Injectable } from '@angular/core';
import { CustomError, ErrorType, ServerError, UserError } from '../_objects/custom-error';
import { MatDialog } from '@angular/material/dialog';
import { TRPCClientError } from '@trpc/client';
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

        if (error instanceof TRPCClientError) {
            if (error.data.httpStatus >= 400 && error.data.httpStatus <= 499) {
                error = new UserError(error.message, undefined, error.data.httpStatus);
            }
            else {
                error = new ServerError(error.message, error.data.httpStatus);
            }
        }

        if (error instanceof CustomError) {
            if (error.errorData && error.errorData.toLogin) {
                this.accountsService.logout();
            }
            else {
                this.openDialog(error);
            }            
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
