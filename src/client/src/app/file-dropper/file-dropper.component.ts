import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, NgxFileDropModule } from 'ngx-file-drop';
import { InterfaceError } from '../_objects/custom-error';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-file-dropper',
	standalone: true,
	imports: [
        CommonModule,
        NgxFileDropModule,
        MatButtonModule
    ],
	templateUrl: './file-dropper.component.html',
	styleUrl: './file-dropper.component.scss'
})
export class FileDropperComponent {

	files: NgxFileDropEntry[] = [];
    fileToUse: NgxFileDropEntry | null = null;
    rows: string[] = [];

    @Input() disabled: boolean = false;
    @Input() outputLines: boolean = true;
    @Input() acceptedFiles: string = ".txt,.csv";
    
    @Output() fileDataLoaded = new EventEmitter<string | string[]>();

	dropped(files: NgxFileDropEntry[]) {
        this.files = files;
        for (const droppedFile of files) {
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {
                    let fileReader = new FileReader();
                    fileReader.onload = (e) => {
                        this.fileToUse = droppedFile;
                        if (this.outputLines) {
                            this.parseStringList(fileReader.result as string);
                        }
                        else {
                            this.fileDataLoaded.emit(fileReader.result as string);
                        }
                    }
                    fileReader.readAsText(file);
                });
            }
            else {
                throw new InterfaceError(`Not a file: ${this.fileToUse ? this.fileToUse.relativePath: ""}`)
            }
        }
    }

    parseStringList(input: string) {
        this.rows = input.split(/\r?\n/);
        this.fileDataLoaded.emit(this.rows);
    }
}
