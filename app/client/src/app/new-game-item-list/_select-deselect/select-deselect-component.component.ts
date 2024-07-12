import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-select-deselect-component',
    standalone: true,
    imports: [
        MatButtonModule
    ],
    templateUrl: './select-deselect-component.component.html',
    styleUrl: './select-deselect-component.component.scss'
})
export class SelectDeselectComponentComponent {

    @Output() selected = new EventEmitter<boolean>();
    @Output() deselected = new EventEmitter<boolean>();

    selectAll() {
        this.selected.emit(true);
    }

    deselectAll() {
        this.deselected.emit(true);
    }
}
