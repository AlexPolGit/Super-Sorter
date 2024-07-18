import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
	selector: 'app-file-dropper',
	standalone: true,
	imports: [
        CommonModule,
        MatButtonModule,
        MatCardModule
    ],
	templateUrl: './file-dropper.component.html',
	styleUrl: './file-dropper.component.scss'
})
export class FileDropperComponent {

    rows: string[] = [];

    @Input() disabled: boolean = false;
    @Input() outputLines: boolean = true;
    @Input() acceptedFiles: string[] = ["text/plain", "text/csv"];
    
    @Output() fileDataLoaded = new EventEmitter<string | string[]>();

	@ViewChild('fileInput', { static: false }) fileInput!: ElementRef;

    uploadFile(event: any) {
        const file = event.target.files[0] as File;

        if (this.acceptedFiles.indexOf(file?.type) === -1) {
            this.removesFile();
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target) {
                const fileContents = e.target.result as string;
                this.emitContents(fileContents);
            }
        };
        reader.readAsText(file);
    }

    removesFile() {
        if (this.fileInput && this.fileInput.nativeElement) {
            this.fileInput.nativeElement.value = null;
        }
    }

    emitContents(content: string) {
        if (this.outputLines) {
            this.rows = content.split(/\r?\n/);
            this.fileDataLoaded.emit(this.rows);
        }
        else {
            this.fileDataLoaded.emit(content);
        }
    }
}
