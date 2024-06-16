import { Component } from '@angular/core';
import { InterfaceError, UserError } from '../_objects/custom-error';
import { SessionExportObject } from '../_objects/export-gamestate';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-import-session',
    templateUrl: './import-session.component.html',
    styleUrl: './import-session.component.scss'
})
export class ImportSessionComponent {

    constructor(private dialogRef: MatDialogRef<ImportSessionComponent>) {}

    fileDataLoaded(event: any) {
        try {
            let sessionData = JSON.parse(event);

            if (
                Object.hasOwn(sessionData, 'type') && typeof(sessionData.type) === 'string' &&
                Object.hasOwn(sessionData, 'items') && Array.isArray(sessionData.items)
            ) {
                (sessionData as SessionExportObject).items.forEach((item: string) => {
                    if (typeof(item) !== 'string') {
                        throw new SyntaxError();
                    }
                });
                
                this.startImport(sessionData);
            }
            else {
                throw new SyntaxError();
            }
        }
        catch(ex) {
            if (ex instanceof SyntaxError) {
                throw new UserError(
                    $localize`:@@import-session-error-invalid-json-desc:Please input a valid import JSON file.`,
                    $localize`:@@import-session-error-invalid-json-title:Invalid Import`
                );
            }
            else {
                throw new InterfaceError("Unknown error during import.");
            }
        }
    }

    startImport(sessionData: SessionExportObject) {
        this.dialogRef.close(sessionData);
    }
}
