import { ErrorHandler, Injectable } from '@angular/core';
import { CustomError, ErrorType } from '../_objects/custom-error';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../dialogs/error-dialog/error-dialog.component';
import { LoggerService } from './logger-service';

@Injectable({ providedIn: 'root' })
export class CustomErrorHandler implements ErrorHandler {

    constructor(
        private logger: LoggerService,
        public dialog: MatDialog
    ) {}

    handleError(error: Error) {
        this.logger.error(`TRACE: {0}`, error.stack);
        if (error instanceof CustomError) {
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
