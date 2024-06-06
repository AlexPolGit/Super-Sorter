import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, NgxFileDropModule } from 'ngx-file-drop';

@Component({
	selector: 'app-file-dropper',
	standalone: true,
	imports: [ CommonModule, NgxFileDropModule ],
	templateUrl: './file-dropper.component.html',
	styleUrl: './file-dropper.component.scss'
})
export class FileDropperComponent {
	files: NgxFileDropEntry[] = [];
    fileToUse: NgxFileDropEntry | null = null;
    rows: string[] = [];
    @Output() fileDataLoaded = new EventEmitter<string[]>();

	dropped(files: NgxFileDropEntry[]) {
        this.files = files;
        for (const droppedFile of files) {
            if (droppedFile.fileEntry.isFile) {
                const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {
                    let fileReader = new FileReader();
                    fileReader.onload = (e) => {
                        this.fileToUse = droppedFile;
                        this.parseStringList(fileReader.result as string);
                    }
                    fileReader.readAsText(file);
                });
            }
            else {
                console.error("ERROR: NOT FILE");
            }
        }
    }

    parseStringList(input: string) {
        try {
            this.rows = input.split(/\r?\n/);
            this.fileDataLoaded.emit(this.rows);
        }
        catch(e) {
            console.error(e);
        }
    }
}
