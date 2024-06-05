import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SortableObject } from '../_objects/sortables/sortable';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-sortable-item-tile',
    standalone: true,
    imports: [ MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule ],
    templateUrl: './sortable-item-tile.component.html',
    styleUrl: './sortable-item-tile.component.scss'
})
export class SortableItemTileComponent {
    @Input() item: SortableObject = new SortableObject();
    @Output() selected = new EventEmitter();
    @Output() deleted = new EventEmitter();

    selectThis() {
        this.selected.emit();
    }

    deleteThis() {
        this.deleted.emit();
    }

    openLink() {
        let link = this.item.getLink();
        if (link) {
            window.open(link, "_blank");
        }
    }
}
